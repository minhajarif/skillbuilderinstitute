// =========================
// 1) HERO SLIDER (5 seconds)
// =========================
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  let index = 0;

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === i);
    });
  }

  showSlide(0);

  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 5000); // 5 seconds
})();


// =========================
// 2) DROPDOWN (Explore Training)
// =========================
(function () {
  const navItem = document.getElementById("exploreItem");
  const panel = document.getElementById("explorePanel");

  // Click toggle
  document.getElementById("exploreToggle").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    navItem.classList.toggle("open");
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    navItem.classList.remove("open");
  });
})();


// =========================
// 3) LANGUAGE SWITCHER
// =========================
(function () {
  const langBtn = document.getElementById("langBtn");
  const langPanel = document.getElementById("langPanel");

  const translations = {
    en: {
      "nav.home": "Home",
      "nav.explore": "Explore Training",
      "nav.career": "Career & Guidance",
      "nav.about": "About Us",
      "nav.contact": "Contact Us"
    },
    hi: {
      "nav.home": "होम",
      "nav.explore": "एक्सप्लोर ट्रेनिंग",
      "nav.career": "कैरियर एवं मार्गदर्शन",
      "nav.about": "हमारे बारे में",
      "nav.contact": "संपर्क करें"
    },
    ar: {
      "nav.home": "الرئيسية",
      "nav.explore": "استكشاف التدريب",
      "nav.career": "الإرشاد المهني",
      "nav.about": "معلومات عنا",
      "nav.contact": "اتصل بنا"
    }
  };

  // Toggle language panel
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langPanel.style.display =
      langPanel.style.display === "block" ? "none" : "block";
  });

  // Hide panel when clicking outside
  document.addEventListener("click", () => {
    langPanel.style.display = "none";
  });

  // Apply language
  document.querySelectorAll(".lang-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      document.getElementById("langCode").textContent = lang.toUpperCase();
      langPanel.style.display = "none";

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });

      if (lang === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.setAttribute("dir", "ltr");
      }
    });
  });
})();


// =========================
// 4) FOOTER YEAR
// =========================
document.getElementById("year").textContent = new Date().getFullYear();
