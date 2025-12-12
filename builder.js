// builder.js
// Put this file next to index.html and ensure the name is exactly "builder.js" (lowercase).

/* ===== Slider (auto-play + preload) ===== */
(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  if(!slides || slides.length === 0) return;
  let idx = 0;
  function show(i){
    slides.forEach((s,si)=> {
      s.classList.toggle('active', si === i);
    });
  }
  // Preload images
  slides.forEach(s => {
    const src = s.dataset.img;
    if(src){
      const img = new Image();
      img.src = src;
    }
  });
  // initial
  show(0);
  // interval
  const interval = 4500;
  setInterval(()=> {
    idx = (idx + 1) % slides.length;
    show(idx);
  }, interval);
})();

/* ===== Explore dropdown toggle (click + keyboard) ===== */
(function(){
  const exploreToggle = document.getElementById('exploreToggle');
  const exploreItem = document.getElementById('exploreItem');
  if(!exploreToggle || !exploreItem) return;
  exploreToggle.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    exploreItem.classList.toggle('open');
  });
  document.addEventListener('click', ()=> exploreItem.classList.remove('open'));
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') exploreItem.classList.remove('open'); });
})();

/* ===== Language switcher (i18n labels & RTL) ===== */
(function(){
  const langBtn = document.getElementById('langBtn');
  const langPanel = document.getElementById('langPanel');
  const translations = {
    en:{ "nav.home":"Home","nav.explore":"Explore Training","nav.career":"Career & Guidance","nav.about":"About Us","nav.contact":"Contact Us" },
    hi:{ "nav.home":"होम","nav.explore":"एक्सप्लोर ट्रेनिंग","nav.career":"कैरियर एवं मार्गदर्शन","nav.about":"हमारे बारे में","nav.contact":"संपर्क करें" },
    ar:{ "nav.home":"الرئيسية","nav.explore":"استكشاف التدريب","nav.career":"الإرشاد المهني","nav.about":"معلومات عنا","nav.contact":"اتصل بنا" }
  };
  if(!langBtn || !langPanel) return;
  langBtn.addEventListener('click', (e)=> {
    e.stopPropagation();
    langPanel.style.display = langPanel.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', ()=> { if(langPanel) langPanel.style.display = 'none'; });
  Array.from(document.querySelectorAll('.lang-item')).forEach(b=>{
    b.addEventListener('click', ()=> {
      const code = b.dataset.lang;
      if(document.getElementById('langCode')) document.getElementById('langCode').textContent = code.toUpperCase();
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key = el.getAttribute('data-i18n');
        if(translations[code] && translations[code][key]) el.textContent = translations[code][key];
      });
      if(code === 'ar'){ document.documentElement.setAttribute('dir','rtl'); } else { document.documentElement.setAttribute('dir','ltr'); }
      if(langPanel) langPanel.style.display = 'none';
    });
  });
})();

/* ===== Footer year ===== */
(function(){ const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear(); })();
