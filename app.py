from flask import Flask, render_template, jsonify
from destek import hava_Durumu, bes_gunluk_tahmin
import urllib.parse
import requests
from dotenv import load_dotenv
import os
load_dotenv()

API_KEY = os.getenv("API_KEY")
app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/weather/<sehir>")
def api_weather(sehir):
    sehir = sehir.strip()  # title() kaldırıldı
    sehir_encoded = urllib.parse.quote(sehir)  # Türkçe karakterler için encode

    hava = hava_Durumu(sehir_encoded)

    if hava is None:
        return jsonify({"error": "Şehir bulunamadı"}), 404

    tahminler = bes_gunluk_tahmin(sehir_encoded)

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
        "tahminler": tahminler
    })
@app.route("/api/ip-location")
def ip_location():
    try:
        r = requests.get("http://ip-api.com/json").json()
        return {"sehir": r.get("city", "")}
    except:
        return {"sehir": ""}


if __name__ == "__main__":
    app.run(debug=True)
