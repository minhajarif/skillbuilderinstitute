/* builder.js
   For: Skills Builder Institute
   Place this file as builder.js and ensure index.html includes: <script src="builder.js"></script>
   Purpose: slider, dropdown, language switcher, hero sizing, footer year, accessibility helpers
*/

(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- DOM Ready ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    const header = $(".site-header");
    const slidesWrap = $(".slides-wrap");
    const slides = $$(".slide", slidesWrap || document);
    const exploreToggle = $("#exploreToggle");
    const exploreItem = $("#exploreItem");
    const explorePanel = $("#explorePanel");
    const langBtn = $("#langBtn");
    const langPanel = $("#langPanel");
    const langItems = $$(".lang-item");
    const i18nTargets = $$("[data-i18n]");
    const yearEl = $("#year");

    /* ---------- 1) HERO SIZING - keep hero below sticky header (prevents overlap on all viewports) ---------- */
    function adjustHeroHeight() {
      if (!slidesWrap || !header) return;
      // compute available viewport height minus header height (min 240px)
      const headerH = header.getBoundingClientRect().height || 64;
      const available = window.innerHeight - headerH;
      const minHeight = Math.max(240, Math.round(available * 0.9)); // keep a sane min
      slidesWrap.style.minHeight = minHeight + "px";
      // ensure slides-inner also fills
      const slidesInner = slidesWrap.querySelector(".slides-inner");
      if (slidesInner) slidesInner.style.minHeight = minHeight + "px";
    }

    // Run on load and resize
    adjustHeroHeight();
    window.addEventListener("resize", adjustHeroHeight);
    // Also run after orientation changes (mobile)
    window.addEventListener("orientationchange", () => setTimeout(adjustHeroHeight, 250));

    /* ---------- 2) SLIDER: preload images + autoplay fade ---------- */
    (function initSlider() {
      if (!slides || !slides.length) return;

      // preload backgrounds used via data-img
      slides.forEach((s) => {
        const url = s.dataset.img || "";
        if (url) {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            // nothing special needed beyond preloading
          };
          img.onerror = () => {
            // if image fails, keep slide but reduce opacity to avoid white flash
            s.style.backgroundColor = "#e9eef2";
          };
        }
      });

      let idx = 0;
      const len = slides.length;
      const intervalMs = 4200; // 4.2s per slide (smooth, not too quick)
      let timer = null;

      function show(i) {
        slides.forEach((sl, j) => {
          const isActive = j === i;
          sl.classList.toggle("active", isActive);
          // keep inactive slides visually hidden for screen readers
          sl.setAttribute("aria-hidden", !isActive);
        });
      }

      // initial
      show(0);

      // interval
      function start() {
        stop();
        timer = setInterval(() => {
          idx = (idx + 1) % len;
          show(idx);
        }, intervalMs);
      }
      function stop() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      // pause on pointer over (desktop) to improve UX
      slidesWrap.addEventListener("pointerenter", stop);
      slidesWrap.addEventListener("pointerleave", start);

      // start autoplay
      start();

      // expose for debug (optional)
      window._sbi_slider = { start, stop, show, getIndex: () => idx };
    })();

    /* ---------- 3) DROPDOWN - Explore Training ---------- */
    (function initExploreDropdown() {
      if (!exploreToggle || !exploreItem || !explorePanel) return;

      // If an anchor is taking to dropdown, prevent navigation when toggling
      exploreToggle.addEventListener("click", function (ev) {
        // If there are links inside dropdown (and user wants to open the page on link),
        // clicking the text should toggle the panel instead of navigating to explore page.
        ev.preventDefault();
        ev.stopPropagation();
        const open = exploreItem.classList.toggle("open");
        exploreToggle.setAttribute("aria-expanded", open ? "true" : "false");
        explorePanel.setAttribute("aria-hidden", open ? "false" : "true");
      });

      // keyboard accessibility: focus in/out => show/hide
      exploreItem.addEventListener("focusin", () => {
        exploreItem.classList.add("open");
        explorePanel.setAttribute("aria-hidden", "false");
      });
      exploreItem.addEventListener("focusout", () => {
        // give small delay for keyboard navigation inside the panel
        setTimeout(() => {
          if (!exploreItem.contains(document.activeElement)) {
            exploreItem.classList.remove("open");
            explorePanel.setAttribute("aria-hidden", "true");
          }
        }, 120);
      });

      // close when clicking outside
      document.addEventListener("click", (e) => {
        if (!exploreItem.contains(e.target)) {
          exploreItem.classList.remove("open");
          explorePanel.setAttribute("aria-hidden", "true");
          exploreToggle.setAttribute("aria-expanded", "false");
        }
      });
    })();

    /* ---------- 4) LANGUAGE PANEL & i18n ---------- */
    (function initLanguage() {
      if (!langBtn || !langPanel) return;

      // small translations set - expand as needed
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

      // toggle panel on button click
      langBtn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        const open = langPanel.style.display === "block";
        langPanel.style.display = open ? "none" : "block";
        langBtn.setAttribute("aria-expanded", open ? "false" : "true");
      });

      // close on outside click
      document.addEventListener("click", () => {
        langPanel.style.display = "none";
        langBtn.setAttribute("aria-expanded", "false");
      });

      // set language click handlers
      langItems.forEach((btn) => {
        btn.addEventListener("click", function (ev) {
          ev.stopPropagation();
          const lang = btn.dataset.lang || "en";
          const flag = btn.dataset.flag || "";
          // update UI label
          const codeEl = document.getElementById("langCode");
          if (codeEl) codeEl.textContent = (lang || "EN").toUpperCase();
          // apply translations
          i18nTargets.forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (key && translations[lang] && translations[lang][key]) {
              el.textContent = translations[lang][key];
            }
          });
          // rtl handling
          if (lang === "ar") {
            document.documentElement.setAttribute("dir", "rtl");
          } else {
            document.documentElement.setAttribute("dir", "ltr");
          }
          // hide panel
          langPanel.style.display = "none";
        });
      });
    })();

    /* ---------- 5) FOOTER YEAR ---------- */
    (function setFooterYear() {
      if (!yearEl) return;
      yearEl.textContent = String(new Date().getFullYear());
    })();

    /* ---------- 6) Accessibility: ESC to close panels ---------- */
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" || ev.key === "Esc") {
        // close explore
        if (exploreItem) {
          exploreItem.classList.remove("open");
          if (explorePanel) explorePanel.setAttribute("aria-hidden", "true");
          if (exploreToggle) exploreToggle.setAttribute("aria-expanded", "false");
        }
        // close lang
        if (langPanel) langPanel.style.display = "none";
        if (langBtn) langBtn.setAttribute("aria-expanded", "false");
      }
    });

    /* ---------- 7) Defensive: if header or nav items are very tall, re-adjust hero after small delay ---------- */
    setTimeout(adjustHeroHeight, 300);
    setTimeout(adjustHeroHeight, 900);
  });
})();
