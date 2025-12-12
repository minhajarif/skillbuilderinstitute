// skill.js — corrected & robust UI script
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* =========================
       1) HERO SLIDER (5s, pause on hover/focus)
       ========================= */
    (function initSlideshow() {
      const slides = Array.from(document.querySelectorAll('.slide'));
      if (!slides.length) return;

      // Preload background images if dataset.img provided or CSS background used
      slides.forEach(s => {
        const url = s.dataset.img || (getComputedStyle(s).backgroundImage || '').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        if (url) {
          const img = new Image();
          img.src = url;
        }
      });

      let idx = slides.findIndex(s => s.classList.contains('active'));
      if (idx < 0) idx = 0, slides[0].classList.add('active');

      const INTERVAL = 5000;
      let timer = null;
      let paused = false;

      function show(i) {
        slides.forEach((s, si) => {
          s.classList.toggle('active', si === i);
        });
      }

      function next() {
        idx = (idx + 1) % slides.length;
        show(idx);
      }

      function start() {
        stop();
        timer = setInterval(() => { if (!paused) next(); }, INTERVAL);
      }

      function stop() {
        if (timer) { clearInterval(timer); timer = null; }
      }

      // pause on hover/focus for better UX
      const wrap = document.getElementById('slidesWrap') || document.querySelector('.slides-wrap');
      if (wrap) {
        wrap.addEventListener('mouseenter', () => { paused = true; });
        wrap.addEventListener('mouseleave', () => { paused = false; });
        // keyboard focus pause for accessibility
        slides.forEach(s => {
          s.addEventListener('focusin', () => { paused = true; });
          s.addEventListener('focusout', () => { paused = false; });
        });
      }

      show(idx);
      start();

      // expose for debug if needed
      window.__skill_slideshow = { start, stop, next, show };
    })();


    /* =========================
       2) EXPLORE DROPDOWN — hover/focus/click/touch-friendly
       ========================= */
    (function initExploreDropdown() {
      const navItem = document.getElementById('exploreItem');
      const toggle = document.getElementById('exploreToggle');
      const panel = document.getElementById('explorePanel');

      if (!navItem || !toggle || !panel) return;

      // Helper to close other nav-items (single open at a time)
      function closeAllExcept(exceptEl) {
        document.querySelectorAll('.nav-item.open').forEach(it => {
          if (it !== exceptEl) it.classList.remove('open');
        });
      }

      // Mouse interactions
      navItem.addEventListener('mouseenter', () => {
        closeAllExcept(navItem);
        navItem.classList.add('open');
      });
      navItem.addEventListener('mouseleave', () => {
        // only close if focus not inside
        if (!navItem.matches(':focus-within')) navItem.classList.remove('open');
      });

      // Keep open while hovering panel (prevents flicker)
      panel.addEventListener('mouseenter', () => navItem.classList.add('open'));
      panel.addEventListener('mouseleave', () => { if (!navItem.matches(':focus-within')) navItem.classList.remove('open'); });

      // Keyboard accessibility (focusin / focusout)
      navItem.addEventListener('focusin', () => {
        closeAllExcept(navItem);
        navItem.classList.add('open');
      });
      navItem.addEventListener('focusout', (ev) => {
        // if focus moved outside the navItem, close it
        if (!navItem.contains(ev.relatedTarget)) navItem.classList.remove('open');
      });

      // Click toggle for touch devices: first tap opens, second tap follows link
      toggle.addEventListener('click', function (e) {
        // If there is a dropdown, prevent immediate navigation
        if (panel) {
          e.preventDefault();
          e.stopPropagation();
          const willOpen = !navItem.classList.contains('open');
          closeAllExcept(navItem);
          if (willOpen) navItem.classList.add('open');
          else navItem.classList.remove('open');
        }
      }, { passive: false });

      // Close when clicking outside
      document.addEventListener('click', (ev) => {
        if (!ev.target.closest('.nav-item')) {
          document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
        }
      });

      // Close on Escape
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' || ev.key === 'Esc') {
          navItem.classList.remove('open');
        }
      });
    })();


    /* =========================
       3) LANGUAGE SWITCHER (safe)
       - toggles panel
       - updates nav text for data-i18n keys
       - sets dir="rtl" for Arabic
       ========================= */
    (function initLanguageSwitcher() {
      const langBtn = document.getElementById('langBtn');
      const langPanel = document.getElementById('langPanel');
      const langCodeEl = document.getElementById('langCode');
      const langFlagEl = document.getElementById('langFlag');

      const translations = {
        en: { "nav.home": "Home", "nav.explore":"Explore Training", "nav.career":"Career & Guidance", "nav.about":"About Us", "nav.contact":"Contact Us" },
        hi: { "nav.home":"होम", "nav.explore":"एक्सप्लोर ट्रेनिंग", "nav.career":"कैरियर एवं मार्गदर्शन", "nav.about":"हमारे बारे में", "nav.contact":"संपर्क करें" },
        ar: { "nav.home":"الرئيسية", "nav.explore":"استكشاف التدريب", "nav.career":"الإرشاد المهني", "nav.about":"معلومات عنا", "nav.contact":"اتصل بنا" }
      };

      if (!langBtn || !langPanel) return;

      // Toggle language panel
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = langPanel.style.display === 'block';
        // close other panels if any
        document.querySelectorAll('.lang-panel').forEach(p => { if (p !== langPanel) p.style.display = 'none'; });
        langPanel.style.display = open ? 'none' : 'block';
      });

      // Hide when clicking outside
      document.addEventListener('click', () => { langPanel.style.display = 'none'; });

      // Language selection
      Array.from(document.querySelectorAll('.lang-item')).forEach(btn => {
        btn.addEventListener('click', () => {
          const code = (btn.dataset && btn.dataset.lang) ? btn.dataset.lang : btn.getAttribute('data-lang') || 'en';
          const flag = (btn.dataset && btn.dataset.flag) ? btn.dataset.flag : btn.getAttribute('data-flag') || '';

          if (langCodeEl) langCodeEl.textContent = code.toUpperCase();
          if (langFlagEl && flag) langFlagEl.textContent = flag;
          langPanel.style.display = 'none';

          // update translations for elements with data-i18n
          document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[code] && translations[code][key]) el.textContent = translations[code][key];
          });

          // RTL handling
          if (code === 'ar') document.documentElement.setAttribute('dir', 'rtl');
          else document.documentElement.setAttribute('dir', 'ltr');
        });
      });
    })();


    /* =========================
       4) FOOTER YEAR (safe)
       ========================= */
    (function setFooterYear() {
      const y = new Date().getFullYear();
      const yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = y;
    })();


    /* =========================
       5) Defensive runtime fixes
       - ensure header/footer visually span full width
       ========================= */
    (function runtimeFixes() {
      function apply() {
        const header = document.querySelector('.site-header');
        const footer = document.querySelector('.site-footer');
        if (header) { header.style.left = '0'; header.style.right = '0'; header.style.width = '100%'; }
        if (footer) { footer.style.left = '0'; footer.style.right = '0'; footer.style.width = '100%'; }
      }
      apply();
      window.addEventListener('resize', apply);
    })();

  }); // DOMContentLoaded
})();
