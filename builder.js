// Builder.js
// Clean, minimal JS for slideshow, dropdown, language, footer year.
// Ready to use — replace your old JS with this file.
// Do NOT change the WhatsApp float or its link.

(function(){
  'use strict';

  /* ========== HERO SLIDESHOW ========== */
  (function initSlideshow(){
    const slides = Array.from(document.querySelectorAll('.slide'));
    if(!slides || slides.length === 0) return;

    // preload images for smoother display
    slides.forEach(s => {
      const url = s.dataset.img;
      if(url){
        const im = new Image();
        im.src = url;
      }
    });

    let idx = 0;
    function show(i){
      slides.forEach((s,si)=> s.classList.toggle('active', si === i));
    }

    show(0);
    // rotate slides every 4500ms
    setInterval(()=> {
      idx = (idx + 1) % slides.length;
      show(idx);
    }, 4500);
  })();

  /* ========== DROPDOWN (Explore Training) ========== */
  (function initExploreDropdown(){
    const navItem = document.getElementById('exploreItem');
    const toggle = document.getElementById('exploreToggle');
    if(!navItem || !toggle) return;

    // On click/tap: toggle .open (desktop hover still works via CSS)
    toggle.addEventListener('click', function(e){
      // allow modifier-clicks to work normally (open in new tab)
      if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      navItem.classList.toggle('open');
      const expanded = navItem.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    // close when clicking outside
    document.addEventListener('click', function(){
      if(navItem.classList.contains('open')){
        navItem.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // close on Escape
    navItem.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        navItem.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  })();

  /* ========== LANGUAGE SWITCHER ========== */
  (function initLangSwitcher(){
    const langBtn = document.getElementById('langBtn');
    const langPanel = document.getElementById('langPanel');
    const items = document.querySelectorAll('.lang-item');
    if(!langBtn || !langPanel || !items) return;

    const translations = {
      en:{ "nav.home":"Home","nav.explore":"Explore Training","nav.career":"Career & Guidance","nav.about":"About Us","nav.contact":"Contact Us" },
      hi:{ "nav.home":"होम","nav.explore":"एक्सप्लोर ट्रेनिंग","nav.career":"कैरियर एवं मार्गदर्शन","nav.about":"हमारे बारे में","nav.contact":"संपर्क करें" },
      ar:{ "nav.home":"الرئيسية","nav.explore":"استكشاف التدريب","nav.career":"الإرشاد المهني","nav.about":"معلومات عنا","nav.contact":"اتصل بنا" }
    };

    langBtn.addEventListener('click', function(e){
      e.stopPropagation();
      const isOpen = langPanel.style.display === 'block';
      langPanel.style.display = isOpen ? 'none' : 'block';
    });

    // hide on outside click
    document.addEventListener('click', () => { langPanel.style.display = 'none'; });

    items.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.lang;
        const codeEl = document.getElementById('langCode');
        if(codeEl) codeEl.textContent = (code || 'en').toUpperCase();
        langPanel.style.display = 'none';
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if(translations[code] && translations[code][key]) el.textContent = translations[code][key];
        });
        if(code === 'ar'){ document.documentElement.setAttribute('dir','rtl'); }
        else { document.documentElement.setAttribute('dir','ltr'); }
      });
    });
  })();

  /* ========== FOOTER YEAR ========== */
  (function setFooterYear(){
    const y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  })();

})();
