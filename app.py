from flask import Flask, render_template, jsonify
from destek import hava_Durumu, bes_gunluk_tahmin
from database import tablo_olustur, hava_kaydet, son_kayitlar
from moon import ay_evresi_detay
import urllib.parse
import requests
from dotenv import load_dotenv
import os
from destek import CityNotFound
from requests.exceptions import Timeout, ConnectionError
from database import close_db

load_dotenv()
API_KEY = os.getenv("API_KEY")


app = Flask(__name__)

with app.app_context():
    tablo_olustur()

@app.errorhandler(CityNotFound)
def handle_city_error(e):
    return jsonify({"error": "Şehir bulunamadı"}), 404


@app.errorhandler(Timeout)
def handle_timeout(e):
    return jsonify({"error": "API zaman aşımı"}), 504


@app.errorhandler(ConnectionError)
def handle_connection(e):
    return jsonify({"error": "Bağlantı hatası"}), 503


@app.errorhandler(Exception)
def handle_general_error(e):
    return jsonify({"error": "Sunucu hatası"}), 500

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/weather/<sehir>")
def api_weather(sehir):
    sehir = urllib.parse.quote(sehir.strip())
    hava = hava_Durumu(sehir)

    hava_kaydet(hava["sehir"], hava["sicaklik"])
    tahminler = bes_gunluk_tahmin(sehir)

    ay = ay_evresi_detay()  # 🌙 EKLENDİ

    return jsonify({
        "sehir": hava["sehir"],
        "sicaklik": hava["sicaklik"],
        "durum": hava["durum"],
        "ikon": hava["ikon"],
        "saat": hava["saat"],
        "nem": hava["nem"],
        "hissedilen": hava["hissedilen"],
        "gun_dogumu": hava["gun_dogumu"],
        "gun_batimi": hava["gun_batimi"],
        "tahminler": tahminler,
        "ay_evresi": ay["ay_evresi"]  # 🌙 EKLENDİ
    })



@app.route("/api/gecmis")
def gecmis():
    veriler = son_kayitlar()
    return jsonify([
        {"sehir": v[0], "sicaklik": v[1]}
        for v in veriler
    ])


@app.route("/api/ip-location")
def ip_location():
    try:
        r = requests.get("http://ip-api.com/json").json()
        return {"sehir": r.get("city", "")}
    except:
        return {"sehir": ""}


@app.route("/api/moon")
def moon_phase():
    return jsonify(ay_evresi_detay())

@app.teardown_appcontext
def close_connection(exception):
    close_db()

if __name__ == "__main__":
    app.run(debug=True)
