/* ======================================================
   HOME PAGE JAVASCRIPT
   Works for:
   - Navbar dropdown
   - Language switcher
   - Slider autoplay
   - Footer year
   ====================================================== */

/* ================= SLIDER AUTOPLAY ================= */
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  let idx = 0;

  function show(i) {
    slides.forEach((s, si) => s.classList.toggle("active", si === i));
  }

  show(0);

  setInterval(() => {
    idx = (idx + 1) % slides.length;
    show(idx);
  }, 3800);

  slides.forEach((s) => {
    const img = new Image();
    img.src = s.dataset.img;
  });
})();

/* ================= DROPDOWN: EXPLORE TRAINING ================= */
(function () {
  const exploreItem = document.getElementById("exploreItem");
  const explorePanel = document.getElementById("explorePanel");

  if (!exploreItem || !explorePanel) return;

  // Hover open
  exploreItem.addEventListener("mouseenter", () => {
    exploreItem.classList.add("open");
  });
  exploreItem.addEventListener("mouseleave", () => {
    exploreItem.classList.remove("open");
  });

  // Mobile click open
  exploreItem.addEventListener("click", function (e) {
    if (window.innerWidth < 900) {
      e.preventDefault();
      exploreItem.classList.toggle("open");
    }
  });
})();

/* ================= LANGUAGE SELECTOR ================= */
(function () {
  const langBtn = document.getElementById("langBtn");
  const langPanel = document.getElementById("langPanel");

  if (!langBtn || !langPanel) return;

  const translations = {
    en: {
      "nav.home": "Home",
      "nav.explore": "Explore Training",
      "nav.career": "Career & Guidance",
      "nav.about": "About Us",
      "nav.contact": "Contact Us",
    },
    hi: {
      "nav.home": "होम",
      "nav.explore": "एक्सप्लोर ट्रेनिंग",
      "nav.career": "कैरियर एवं मार्गदर्शन",
      "nav.about": "हमारे बारे में",
      "nav.contact": "संपर्क करें",
    },
    ar: {
      "nav.home": "الرئيسية",
      "nav.explore": "استكشاف التدريب",
      "nav.career": "الإرشاد المهني",
      "nav.about": "معلومات عنا",
      "nav.contact": "اتصل بنا",
    },
  };

  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langPanel.style.display =
      langPanel.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    langPanel.style.display = "none";
  });

  document.querySelectorAll(".lang-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;

      document.getElementById("langCode").textContent = lang.toUpperCase();

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });

      // RTL for Arabic
      if (lang === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.removeAttribute("dir");
      }

      langPanel.style.display = "none";
    });
  });
})();

/* ================= FOOTER YEAR ================= */
document.getElementById("year").textContent = new Date().getFullYear();
