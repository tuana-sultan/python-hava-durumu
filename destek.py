import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
BIRIM = "metric"
DIL = "tr"


def bes_gunluk_tahmin(sehir_adi):
    url = (
        "https://api.openweathermap.org/data/2.5/forecast"
        f"?q={sehir_adi}&appid={API_KEY}&units={BIRIM}&lang={DIL}"
    )

    try:
        r = requests.get(url)
        if r.status_code != 200:
            print(f"bes_gunluk_tahmin HATA: {r.status_code} - {r.text}")
            return []

        data = r.json()
        gunler = []

        for i in data.get("list", []):
            if "12:00:00" in i.get("dt_txt", ""):
                gunler.append({
                    "tarih": i["dt_txt"].split(" ")[0],
                    "sicaklik": round(i["main"]["temp"]),
                    "ikon": i["weather"][0]["icon"]
                })

        return gunler

    except Exception as e:
        print("bes_gunluk_tahmin HATA:", e)
        return []


def hava_Durumu(sehir_adi):
    url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?q={sehir_adi}&appid={API_KEY}&units={BIRIM}&lang={DIL}"
    )

    try:
        r = requests.get(url)
        if r.status_code != 200:
            print(f"hava_Durumu HATA: {r.status_code} - {r.text}")
            return None

        data = r.json()
        timezone = data.get("timezone", 0)
        yerel_saat = datetime.utcnow() + timedelta(seconds=timezone)

        return {
            "sehir": data.get("name", sehir_adi),
            "sicaklik": round(data["main"]["temp"], 1),
            "hissedilen": round(data["main"]["feels_like"], 1),
            "nem": data["main"]["humidity"],
            "durum": data["weather"][0]["description"].capitalize(),
            "ikon": data["weather"][0]["icon"],
            "saat": yerel_saat.strftime("%H:%M"),
            "gun_dogumu": datetime.utcfromtimestamp(
                data["sys"]["sunrise"] + timezone
            ).strftime("%H:%M"),
            "gun_batimi": datetime.utcfromtimestamp(
                data["sys"]["sunset"] + timezone
            ).strftime("%H:%M"),
        }

    except Exception as e:
        print("hava_Durumu HATA:", e)
        return None
