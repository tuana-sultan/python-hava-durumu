let yagmurAktif = false;
let karAktif = false;
let aktifGrafik = "sicaklik";
let ayEvre;

// ================= GEÇMİŞ =================
function gecmisKaydet(sehir, sicaklik) {
    let gecmis = JSON.parse(localStorage.getItem("gecmisSehirler")) || [];
    gecmis = gecmis.filter(item => item.sehir !== sehir);
    gecmis.unshift({ sehir, sicaklik });
    if (gecmis.length > 5) gecmis.pop();
    localStorage.setItem("gecmisSehirler", JSON.stringify(gecmis));
}

function gecmisPanelCiz() {
    const liste = document.getElementById("gecmisListe");
    if (!liste) return;
    liste.innerHTML = "";
    const gecmis = JSON.parse(localStorage.getItem("gecmisSehirler")) || [];
    gecmis.forEach(item => {
        const div = document.createElement("div");
        div.className = "gecmis-item";
        div.innerHTML = `
            <span>${item.sehir}</span>
            <span>${item.sicaklik}°C</span>
        `;
        div.addEventListener("click", () => {
            const input = document.getElementById("sehirInput");
            if (input) {
                input.value = item.sehir;
                sehirAra();
            }
        });
        liste.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    const gecmisToggle = document.getElementById("gecmisToggle");
    const gecmisPanel = document.getElementById("gecmisPanel");

    gecmisToggle?.addEventListener("click", () => {
        gecmisPanel.classList.toggle("acik");
        const ok = gecmisToggle.querySelector(".ok");
        ok.textContent = gecmisPanel.classList.contains("acik") ? "◀" : "▶";
    });

    // ================= IP KONUM =================
    fetch("/api/ip-location")
        .then(res => res.json())
        .then(data => {
            const input = document.getElementById("sehirInput");
            if (data.sehir && input) input.value = data.sehir;
        })
        .catch(() => {});

    // ================= YAĞMUR =================
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

    // ================= KAR =================
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

    // ================= BULUT =================
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
        const fog = document.getElementById("fog-layer");
        if (fog) fog.style.opacity = "1";
    }

    function sisKapat() {
        const fog = document.getElementById("fog-layer");
        if (fog) fog.style.opacity = "0";
    }

    // ================= DOM =================
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
    ayEvre = document.getElementById("ayEvreText");

    

    let havaGrafik = null;
    let sonTahminler = [];

    function ekranSonucModu() {
        ustAlan?.classList.add("gizli");
        aramaAlan?.classList.add("gizli");
        sonuc?.classList.remove("gizli");
        geriBtn?.classList.remove("gizli");
    }

    function ekranBaslangicModu() {
        ustAlan?.classList.remove("gizli");
        aramaAlan?.classList.remove("gizli");
        sonuc?.classList.add("gizli");
        geriBtn?.classList.add("gizli");
        document.getElementById("sehirInput").value = "";
        temizleYagmur();
        temizleKar();
        temizleBulut();
        sisKapat();
    }

    // ================= ŞEHİR ARA =================
    window.sehirAra = function () {
        const input = document.getElementById("sehirInput");
        const sehir = input.value.trim();
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
                nem.textContent = `${data.nem}%`;
                hissedilen.textContent = `${data.hissedilen}°C`;

                gecmisKaydet(data.sehir, data.sicaklik);
                gecmisPanelCiz();

                temizleYagmur();
                temizleKar();
                temizleBulut();
                sisKapat();
                if (ayEvre && data.ay_evresi) {
                ayEvre.textContent = data.ay_evresi;
                }


                const h = data.durum.toLowerCase();
                if (h.includes("kar") || h.includes("snow")) karBaslat();
                else if (h.includes("rain") || h.includes("yağmur")) yagmurBaslat();
                else if (h.includes("cloud") || h.includes("bulut")) bulutBaslat();
                else if (h.includes("fog") || h.includes("sis")) sisAc();

                sonTahminler = data.tahminler;
                tahminleriCiz(sonTahminler);
                grafikCiz(sonTahminler);
                ekranSonucModu();
            })
            .catch(err => alert(err.message));
    };

    function tahminleriCiz(tahminler) {
        tahminlerDiv.innerHTML = "";
        tahminler.forEach(gun => {
            const kart = document.createElement("div");
            kart.className = "tahmin-kart";
            kart.innerHTML = `
                <div class="tahmin-gun">${gunAdi(gun.tarih)}</div>
                <img src="https://openweathermap.org/img/wn/${gun.ikon}@2x.png">
                <div class="tahmin-sicaklik">${gun.sicaklik}°C</div>
            `;
            tahminlerDiv.appendChild(kart);
        });
    }

    function grafikCiz(tahminler) {
        const canvas = document.getElementById("grafikCanvas");
        if (!canvas || typeof Chart === "undefined") return;

        if (havaGrafik) havaGrafik.destroy();

        const dataset = aktifGrafik === "sicaklik"
            ? tahminler.map(g => g.sicaklik)
            : tahminler.map(g => g.yagis ?? 0);

        havaGrafik = new Chart(canvas, {
            type: aktifGrafik === "yagis" ? "bar" : "line",
            data: {
                labels: tahminler.map(g => gunAdi(g.tarih)),
                datasets: [{
                label: aktifGrafik === "sicaklik" ? "Sıcaklık (°C)" : "Yağış (mm)",
                data: dataset,

                // 🔴 SICAKLIK STİLİ
                borderColor: aktifGrafik === "sicaklik" ? "#ff3b3b" : "#2196f3",
                backgroundColor: aktifGrafik === "sicaklik"
                    ? "rgba(255, 59, 59, 0.25)"
                    : "rgba(33, 150, 243, 0.6)",

                tension: aktifGrafik === "sicaklik" ? 0.4 : 0,
                fill: aktifGrafik === "sicaklik",
                pointRadius: aktifGrafik === "sicaklik" ? 4 : 0
            }]

            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: aktifGrafik === "yagis"
                    ? { y: { beginAtZero: true } }
                    : {}
            }
        });
    }

    function gunAdi(tarih) {
        return new Date(tarih).toLocaleDateString("tr-TR", { weekday: "short" });
    }

    document.getElementById("araBtn")?.addEventListener("click", sehirAra);
    document.getElementById("sehirInput")?.addEventListener("keydown", e => {
        if (e.key === "Enter") sehirAra();
    });

    geriBtn?.addEventListener("click", ekranBaslangicModu);

    // ================= GRAFİK BUTONLARI =================
    sicaklikBtn?.addEventListener("click", () => {
        aktifGrafik = "sicaklik";
        grafikCiz(sonTahminler);
        sicaklikBtn.classList.add("aktif");
        yagisBtn.classList.remove("aktif");
    });

    yagisBtn?.addEventListener("click", () => {
        aktifGrafik = "yagis";
        grafikCiz(sonTahminler);
        yagisBtn.classList.add("aktif");
        sicaklikBtn.classList.remove("aktif");
    });
});

// ================= STARS =================
let starsCreated = false;

function createStars() {
    const container = document.querySelector(".stars");
    if (!container || starsCreated) return;
    container.innerHTML = "";
    for (let i = 0; i < 120; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * window.innerWidth + "px";
        star.style.top = Math.random() * window.innerHeight + "px";
        container.appendChild(star);
    }
    starsCreated = true;
}

function removeStars() {
    const container = document.querySelector(".stars");
    if (!container) return;
    container.innerHTML = "";
    starsCreated = false;
}
