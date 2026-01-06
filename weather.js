let yagmurAktif = false;
let karAktif = false;

document.addEventListener("DOMContentLoaded", () => {
// 🌍 IP ÜZERİNDEN ŞEHİR TAHMİNİ
fetch("/api/ip-location")
    .then(res => res.json())
    .then(data => {
        if (data.sehir) {
            const input = document.getElementById("sehirInput");
            input.value = data.sehir;
        }
    })
    .catch(err => console.log("IP konum hatası:", err));

    // ====== YAĞMUR ======
    function temizleYagmur() {
        document.querySelectorAll(".rain-drop").forEach(e => e.remove());
        yagmurAktif = false;
    }

    function yagmurBaslat() {
        if (yagmurAktif) return;
        yagmurAktif = true;

        for (let i = 0; i < 120; i++) {
            const drop = document.createElement("div");
            drop.classList.add("rain-drop");

            drop.style.left = Math.random() * window.innerWidth + "px";
            drop.style.animationDuration = (0.5 + Math.random()) + "s";
            drop.style.animationDelay = Math.random() * 2 + "s";

            document.documentElement.appendChild(drop);
        }
    }

    // ====== KAR ======
    function temizleKar() {
        document.querySelectorAll(".snow-flake").forEach(e => e.remove());
        karAktif = false;
    }

    function karBaslat() {
        if (karAktif) return;
        karAktif = true;

        for (let i = 0; i < 100; i++) {
            const snow = document.createElement("div");
            snow.classList.add("snow-flake");

            snow.style.left = Math.random() * window.innerWidth + "px";
            snow.style.animationDuration = (3 + Math.random() * 5) + "s";
            snow.style.animationDelay = Math.random() * 5 + "s";

            document.documentElement.appendChild(snow);
        }
    }
// ====== BULUT ======
let bulutAktif = false;

function temizleBulut() {
    document.querySelectorAll(".cloud").forEach(c => c.remove());
    bulutAktif = false;
}

function bulutBaslat() {
    if (bulutAktif) return;
    bulutAktif = true;

    for (let i = 0; i < 6; i++) {
        const cloud = document.createElement("div");
        cloud.classList.add("cloud");

        cloud.style.top = Math.random() * 60 + "vh";
        cloud.style.animationDuration = 40 + Math.random() * 40 + "s";
        cloud.style.opacity = 0.2 + Math.random() * 0.3;

        document.body.appendChild(cloud);
    }
}
function sisAc() {
    document.getElementById("fog-layer").style.opacity = "1";
}

function sisKapat() {
    document.getElementById("fog-layer").style.opacity = "0";
}

    // ====== DOM ======
    const sehirAdi = document.getElementById("sehirAdi");
    const saat = document.getElementById("saat");
    const ikon = document.getElementById("ikon");
    const durum = document.getElementById("durum");
    const nem = document.getElementById("nem");
    const hissedilen = document.getElementById("hissedilen");

    const ustAlan = document.getElementById("ustAlan");
    const aramaAlan = document.getElementById("aramaAlan");
    const sonuc = document.getElementById("sonuc");
    const geriBtn = document.getElementById("geriBtn");
    const tahminlerDiv = document.getElementById("tahminler");

    const sicaklikBtn = document.getElementById("sicaklikBtn");
    const yagisBtn = document.getElementById("yagisBtn");

    let havaGrafik = null;
    let aktifGrafik = "sicaklik";
    let sonTahminler = [];

    // ====== EKRAN MODLARI ======
    function ekranSonucModu() {
        ustAlan.classList.add("gizli");
        aramaAlan.classList.add("gizli");
        sonuc.classList.remove("gizli");
        geriBtn.classList.remove("gizli");
    }

    function ekranBaslangicModu() {
        ustAlan.classList.remove("gizli");
        aramaAlan.classList.remove("gizli");
        sonuc.classList.add("gizli");
        geriBtn.classList.add("gizli");
        document.getElementById("sehirInput").value = "";

        temizleYagmur();
        temizleKar();
        temizleBulut();
        sisKapat();
    }

    // ====== ŞEHİR ARAMA ======
    function sehirAra() {
        const sehir = document.getElementById("sehirInput").value.trim().toLowerCase();
        if (!sehir) return;

        fetch(`/api/weather/${encodeURIComponent(sehir)}`)
            .then(res => {
                if (!res.ok) throw new Error("Şehir bulunamadı");
                return res.json();
            })
            .then(data => {

                sehirAdi.textContent = data.sehir;
                saat.textContent = data.saat;
                ikon.src = `https://openweathermap.org/img/wn/${data.ikon}@2x.png`;
                durum.textContent = data.durum;

                const havaDurumu = data.durum.toLowerCase();

                // önce tüm efektleri temizle
                temizleYagmur();
                temizleKar();
                temizleBulut();

                // ❄️ KAR
                if (havaDurumu.includes("kar") || havaDurumu.includes("snow")) {
                    karBaslat();
                }
                // 🌧️ YAĞMUR
                else if (
                    havaDurumu.includes("yağmur") ||
                    havaDurumu.includes("rain") ||
                    havaDurumu.includes("sağanak") ||
                    havaDurumu.includes("çisenti") ||
                    havaDurumu.includes("fırtına")
                ) {
                    yagmurBaslat();
                }
                // ☁️ BULUT
                else if (
                havaDurumu.includes("cloud") ||
                havaDurumu.includes("bulut") ||
                havaDurumu.includes("overcast") ||
                havaDurumu.includes("few") ||
                havaDurumu.includes("scattered") ||
                havaDurumu.includes("broken")
            ) {
                bulutBaslat();
            }
            // 🌫️ SİS
            else if (
                havaDurumu.includes("sis") ||
                havaDurumu.includes("mist") ||
                havaDurumu.includes("fog") ||
                havaDurumu.includes("haze")
            ) {
                sisAc();
            }
                nem.textContent = `${data.nem}%`;
                hissedilen.textContent = `${data.hissedilen}°C`;

                // 5 GÜNLÜK TAHMİN
                tahminlerDiv.innerHTML = "";
                sonTahminler = data.tahminler;

                data.tahminler.forEach(gun => {
                    tahminlerDiv.innerHTML += `
                        <div class="tahmin-kart">
                            <div class="tahmin-gun">${gunAdi(gun.tarih)}</div>
                            <img src="https://openweathermap.org/img/wn/${gun.ikon}@2x.png">
                            <div class="tahmin-sicaklik">${gun.sicaklik}°C</div>
                        </div>
                    `;
                });

                grafikCiz(sonTahminler);

                gunesYayCiz(data.gun_dogumu, data.gun_batimi);
                document.getElementById("dogusSaat").textContent = data.gun_dogumu;
                document.getElementById("batisSaat").textContent = data.gun_batimi;

                ekranSonucModu();
            })
            .catch(err => alert(err.message));
    }

    // ====== GRAFİK ======
    function grafikCiz(tahminler) {
        const canvas = document.getElementById("grafikCanvas");
        if (!canvas) return;

        if (havaGrafik) havaGrafik.destroy();

        let dataSet =
            aktifGrafik === "sicaklik"
                ? {
                      label: "Sıcaklık (°C)",
                      data: tahminler.map(g => g.sicaklik),
                      borderColor: "#FF5722",
                      backgroundColor: "rgba(255,87,34,0.2)",
                      tension: 0.4
                  }
                : {
                      label: "Yağış (mm)",
                      data: tahminler.map(() => Math.floor(Math.random() * 10)),
                      borderColor: "#2196F3",
                      backgroundColor: "rgba(33,150,243,0.2)",
                      tension: 0.4
                  };

        havaGrafik = new Chart(canvas, {
            type: "line",
            data: {
                labels: tahminler.map(g => gunAdi(g.tarih)),
                datasets: [dataSet]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // ====== GÜNEŞ YAY ======
    function gunesYayCiz(dogus, batis) {
        const canvas = document.getElementById("gunesYay");
        const gunesKart = document.getElementById("gunesKart");
        if (!canvas || !gunesKart) return;

        gunesKart.classList.remove("gizli");

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2 + 20, 70, Math.PI, 0);
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 6;
        ctx.stroke();
    }

    function gunAdi(tarih) {
        return new Date(tarih).toLocaleDateString("tr-TR", { weekday: "short" });
    }

    // ====== EVENTLER ======
    document.getElementById("araBtn").addEventListener("click", sehirAra);
    document.getElementById("sehirInput").addEventListener("keydown", e => {
        if (e.key === "Enter") sehirAra();
    });

    geriBtn.addEventListener("click", ekranBaslangicModu);

    sicaklikBtn.addEventListener("click", () => {
        aktifGrafik = "sicaklik";
        grafikCiz(sonTahminler);
    });

    yagisBtn.addEventListener("click", () => {
        aktifGrafik = "yagis";
        grafikCiz(sonTahminler);
    });
});
/* =========================
   STARS CONTROL (DARK MODE)
========================= */

let starsCreated = false;

function createStars() {
    if (starsCreated) return;

    const container = document.querySelector(".stars");
    container.innerHTML = "";

    for (let i = 0; i < 120; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        star.style.left = Math.random() * window.innerWidth + "px";
        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.fontSize = 8 + Math.random() * 12 + "px";

        container.appendChild(star);
    }

    setInterval(() => {
        const stars = document.querySelectorAll(".star");
        const random = Math.floor(Math.random() * stars.length);
        stars[random]?.classList.toggle("twinkle");
    }, 80);

    starsCreated = true;
}

function removeStars() {
    const container = document.querySelector(".stars");
    container.innerHTML = "";
    starsCreated = false;
}
