import sqlite3
from flask import g #flaskın özel request bazlı hafıza alanı = g, kullanıcı siteye istek attığında o isteğe özel değişken saklama alanıdır

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect("weather.db")
        g.db.row_factory = sqlite3.Row #bilgi tuple değil sölük gibi gelsin diye
    return g.db


def tablo_olustur():
    db = get_db()
    cur = db.cursor() #sql komutu çalıştırır

    cur.execute("""
    CREATE TABLE IF NOT EXISTS gecmis (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        sehir TEXT,
        sicaklik REAL,
        tarih DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    db.commit() #işlemi kalıcı hale getirmek için
    
def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close() #açık  bağlantı ram, production için gerekli 


def ayni_kayit_var_mi(sehir, sicaklik):
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        SELECT 1 FROM gecmis
        WHERE sehir=? AND sicaklik=?
        AND datetime(tarih) > datetime('now', '-5 minutes')
    """, (sehir, sicaklik))

    var = cur.fetchone() is not None # fetchnone sql sonucundan 1 satır almaya yarar
    return var


def hava_kaydet(sehir, sicaklik):
    if ayni_kayit_var_mi(sehir, sicaklik):
        return False

    db = get_db()
    cur = db.cursor()
    cur.execute(
        "INSERT INTO gecmis (sehir, sicaklik) VALUES (?, ?)",
        (sehir, sicaklik)
    )
    db.commit()
    return True


def son_kayitlar(limit=10):
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        SELECT sehir, sicaklik
        FROM gecmis
        ORDER BY tarih DESC
        LIMIT ?
    """, (limit,))

    rows = cur.fetchall() #gelen tüm satırlar liste oluyor
    return rows


def istatistikler():
    db = get_db()
    cur = db.cursor()

    cur.execute("SELECT COUNT(*) FROM gecmis")
    toplam = cur.fetchone()[0]

    cur.execute("""
        SELECT sehir, COUNT(*) as adet
        FROM gecmis
        GROUP BY sehir
        ORDER BY adet DESC
        LIMIT 1
    """)
    populer = cur.fetchone()

    return {
        "toplam_sorgu": toplam,
        "en_cok_aranan_sehir": populer[0] if populer else None
    }
