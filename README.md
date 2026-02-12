# 🌦️ Weather App Python
https://tuanasultan.pythonanywhere.com/

Flask tabanlı, animasyonlu hava durumu web uygulaması.

## ✨ Bu Projenin Özellikleri neler?
- Şehir bazlı hava durumu
- 5 günlük tahmin
- Yağmur / kar / bulut / sis efektleri
- Dark / Light tema
- Güneş doğuş – batış animasyonu
- Chart.js ile grafikler

## 🛠️ Kullanılan Teknolojiler hangileri?
- Python (Flask)
- HTML / CSS / JavaScript
- OpenWeather API
- Chart.js

## 🧰 Kullanılan Teknolojiler

### 🐍 Backend (Python)

- **Python 3**
- **Flask**  
  Web uygulamasının backend yapısını oluşturmak ve API endpoint’lerini yönetmek için kullanıldı.
- **requests**  
  Hava durumu verilerini ve IP tabanlı konum bilgilerini almak için HTTP istekleri göndermede kullanıldı.

> IP tabanlı konum tespiti, harici bir IP Location Web API üzerinden yapılmıştır.  
> Bu işlem için ek bir Python kütüphanesi kullanılmamıştır!

---

### 🌐 Frontend (Web)

- **HTML5**  
  Sayfa yapısı ve içerik düzeni
- **CSS3**  
  Tasarım, animasyonlar, tema sistemi (Dark / Light Mode) ve hava durumu efektleri  
  (yağmur, kar, sis, bulut, yıldız animasyonları)
- **JavaScript (Vanilla JS)**  
  - Tema değiştirme (Dark / Light Mode)
  - Hava durumu verilerinin işlenmesi
  - Animasyon ve efektlerin kontrolü
  - Kullanıcı etkileşimleri ve dinamik içerik yönetimi

---

### 📊 Grafik & Görselleştirme

- **Chart.js**  
  Sıcaklık ve yağış verilerinin grafiksel olarak gösterilmesi için kullanıldı.

---

### 🔗 Harici Servisler (API)

- **Hava Durumu API (OpenWeather)**  
  Anlık ve günlük hava durumu verilerinin alınması için
- **IP Location API**  
  Kullanıcının konumunun IP adresi üzerinden tahmin edilmesi için

---


## 📦 Kurulum İçin Gerekli Python Kütüphaneleri

```txt
flask
requests
python-dotenv 
---
## 🔐 API Key Güvenliği

Bu projede API anahtarı güvenlik sebebiyle GitHub'a eklenmemiştir.

Projeyi çalıştırmak için:

1. Proje dizinine `.env` dosyası oluşturun
2. İçerisine aşağıdaki satırı ekleyin:
