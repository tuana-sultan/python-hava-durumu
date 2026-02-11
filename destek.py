import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from requests.exceptions import Timeout, ConnectionError, HTTPError

load_dotenv()

API_KEY = os.getenv("API_KEY")
BIRIM = "metric"
DIL = "tr"

# === CACHE ===
_cache = {}
CACHE_SURESI = 600  # 10 dakika


class CityNotFound(Exception):
    pass


def api_get(url):
    try:
        r = requests.get(url, timeout=5)

        if r.status_code == 404:
            raise CityNotFound("Şehir bulunamadı")

        r.raise_for_status()

        return r.json()

    except Timeout:
        raise

    except ConnectionError:
        raise




def hava_Durumu(sehir_adi):
    simdi = datetime.utcnow()

    # Cache kontrolü
    if sehir_adi in _cache:
        veri, zaman = _cache[sehir_adi]
        if (simdi - zaman).seconds < CACHE_SURESI:
            return veri

    url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?q={sehir_adi}&appid={API_KEY}&units={BIRIM}&lang={DIL}"
    )

    try:
        data = api_get(url)
        timezone = data.get("timezone", 0)
        yerel_saat = datetime.utcnow() + timedelta(seconds=timezone)

        sonuc = {
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

        _cache[sehir_adi] = (sonuc, simdi)
        return sonuc
    
    except CityNotFound:
        raise

    except (Timeout,ConnectionError):
       raise

    except Exception as e:
        print("Beklenmeyen hata:", e)
        return None



def bes_gunluk_tahmin(sehir_adi):
    url = (
        "https://api.openweathermap.org/data/2.5/forecast"
        f"?q={sehir_adi}&appid={API_KEY}&units={BIRIM}&lang={DIL}"
    )

    try:
        data = api_get(url)
        gunler = []

        for i in data.get("list", []):
            if "12:00:00" in i.get("dt_txt", ""):
                gunler.append({
                    "tarih": i["dt_txt"].split(" ")[0],
                    "sicaklik": round(i["main"]["temp"]),
                    "yagis": i.get("rain", {}).get("3h", 0),
                    "ikon": i["weather"][0]["icon"]
                })

        return gunler

    except CityNotFound:
        return []

    except Timeout:
        print("Tahmin API timeout")
        raise

    except ConnectionError:
        print("Tahmin bağlantı hatası")
        raise

    except Exception as e:
        print("Tahmin beklenmeyen hata:", e)
        return []
