from datetime import datetime


def ay_evresi_hesapla():
    simdi = datetime.utcnow()
    yeni_ay = datetime(2000, 1, 6)

    gun_farki = (simdi - yeni_ay).days
    ay_dongusu = 29.53
    evre = gun_farki % ay_dongusu

    if evre < 1.84566:
        return "Yeni Ay 🌑"
    elif evre < 5.53699:
        return "Hilal 🌒"
    elif evre < 9.22831:
        return "İlk Dördün 🌓"
    elif evre < 12.91963:
        return "Şişkin Ay 🌔"
    elif evre < 16.61096:
        return "Dolunay 🌕"
    elif evre < 20.30228:
        return "Küçülen Ay 🌖"
    elif evre < 23.99361:
        return "Son Dördün 🌗"
    elif evre < 27.68493:
        return "Hilal 🌘"
    else:
        return "Yeni Ay 🌑"


def ay_evresi_detay():
    evre = ay_evresi_hesapla()
    return {
        "ay_evresi": evre,
        "gozlem_uygun": "Dolunay" in evre or "İlk" in evre
    }
