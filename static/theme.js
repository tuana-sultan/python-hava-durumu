document.addEventListener("DOMContentLoaded", () => {
    const temaBtn = document.getElementById("temaBtn");
    const body = document.body;
    const sun = document.querySelector(".sun");
    const starsContainer = document.querySelector(".stars");

    // 🌙 Sayfa açıldığında kayıtlı tema
    const kayitliTema = localStorage.getItem("tema");
    if (kayitliTema === "dark") {
        body.classList.add("dark");
        temaBtn.textContent = "☀️ Light Mode";
        createStars();
        if (sun) sun.style.background = "#555";
    }

    // 🌗 Tema Değiştir
    temaBtn.addEventListener("click", () => {
        body.classList.toggle("dark");

        const darkAktif = body.classList.contains("dark");

        if (darkAktif) {
            temaBtn.textContent = "☀️ Light Mode";
            localStorage.setItem("tema", "dark");

            if (sun) sun.style.background = "#555";
            createStars();

        } else {
            temaBtn.textContent = "🌙 Dark Mode";
            localStorage.setItem("tema", "light");

            if (sun) sun.style.background = "#FFD700";
            removeStars();
        }
    });

    // ⭐ YILDIZ OLUŞTUR
    function createStars() {
        if (!starsContainer) return;
        if (starsContainer.children.length > 0) return;

        for (let i = 0; i < 100; i++) {
            const star = document.createElement("div");
            star.classList.add("box");

            star.style.left = Math.random() * window.innerWidth + "px";
            star.style.top = Math.random() * window.innerHeight + "px";
            star.style.fontSize = 8 + Math.random() * 10 + "px";

            starsContainer.appendChild(star);
        }

        starsContainer.starInterval = setInterval(() => {
            const stars = document.querySelectorAll(".box");
            if (stars.length === 0) return;

            const randomStar = stars[Math.floor(Math.random() * stars.length)];
            randomStar.classList.toggle("animate");
        }, 80);
    }

    // ❌ YILDIZ TEMİZLE
    function removeStars() {
        if (!starsContainer) return;

        clearInterval(starsContainer.starInterval);
        starsContainer.innerHTML = "";
    }
});
