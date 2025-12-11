// builder.js
// Central client-side behaviour for Skills Builder Institute site
// Responsibilities:
// - Explore dropdown show/hide (hover + click + keyboard accessible)
// - Language selector: loads lang JSON (lang/en.json, lang/hi.json, lang/ar.json), caches, translates [data-i18n] nodes
// - Contact form behaviour: dependent city select, "Training" block toggle, validation, mailto compose
// - Small accessibility improvements and safe-guards if some DOM elements are missing

(function () {
  'use strict';

  /* ==========================
     Utility helpers
     ========================== */
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from((root || document).querySelectorAll(sel)); }
  function on(el, evt, fn) { if (!el) return; el.addEventListener(evt, fn); }
  function escapeHtml(str) { // safe text for mailto body
    if (str == null) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function getNested(obj, path) {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
      else return undefined;
    }
    return cur;
  }

  /* ==========================
     Explore Dropdown
     - show panel on hover
     - toggle on click (prevent immediate navigation)
     - keyboard accessibility
     ========================== */
  function initExploreDropdown() {
    const toggle = qs('#exploreToggle') || qsa('.nav-item > a').find?.(a => /Explore/i.test(a.textContent)) || qs('.nav-item a[href*="explore"]');
    const panel = qs('#explorePanel') || qs('.dropdown-panel') || qs('.dropdown-items');

    if (!toggle || !panel) return;

    // show/hide helpers
    const show = () => { panel.style.display = 'block'; panel.setAttribute('aria-hidden', 'false'); };
    const hide = () => { panel.style.display = 'none'; panel.setAttribute('aria-hidden', 'true'); };

    // hover
    toggle.addEventListener('mouseenter', show);
    const parent = toggle.parentElement;
    if (parent) {
      parent.addEventListener('mouseleave', hide);
    } else {
      toggle.addEventListener('mouseleave', hide);
    }

    // click: toggle and prevent navigation if panel available
    toggle.addEventListener('click', function (e) {
      // if the link points to a page and user wants to navigate, they can click again
      if (panel.style.display === 'block') {
        hide();
        return; // let default if they click again
      }
      e.preventDefault();
      show();
    });

    // close when clicking elsewhere
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !panel.contains(e.target)) hide();
    });

    // keyboard accessibility: open with Enter/Space and navigate with arrow keys
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', panel.style.display === 'block' ? 'true' : 'false');
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (panel.style.display === 'block') hide();
        else show();
      } else if (e.key === 'Escape') {
        hide();
        toggle.focus();
      }
    });
  }

  /* ==========================
     Language (i18n) loader + translator
     - expects lang/en.json, lang/hi.json, lang/ar.json
     - translates elements with data-i18n="key.path"
     - updates elements that use specific IDs (like #langText, #langFlag) for UI
     ========================== */
  const LANG_CACHE = {}; // { en: {...}, hi: {...}, ar: {...} }
  let currentLang = 'en';

  async function loadLang(lang) {
    if (!lang) lang = 'en';
    if (LANG_CACHE[lang]) return LANG_CACHE[lang];
    try {
      const res = await fetch((location.pathname.includes('/explore-training&careerguidence/') ? '../' : '') + lang/${lang}.json);
      if (!res.ok) throw new Error('Lang file not found: ' + res.status);
      const json = await res.json();
      LANG_CACHE[lang] = json;
      return json;
    } catch (err) {
      // fallback: if fetch fails, try top-level path
      try {
        const res2 = await fetch(/lang/${lang}.json);
        if (!res2.ok) throw new Error('fallback lang file not found');
        const json2 = await res2.json();
        LANG_CACHE[lang] = json2;
        return json2;
      } catch (err2) {
        console.error('Could not load language file for', lang, err, err2);
        return null;
      }
    }
  }

  function applyTranslations(dict) {
    if (!dict) return;
    // 1) data-i18n elements
    qsa('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const value = getNested(dict, key);
      if (value !== undefined) {
        // preserve original element type for inputs/placeholders
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
          el.placeholder = value;
        } else {
          el.textContent = value;
        }
      }
    });

    // 2) specific common keys for top header (if present)
    const headerEmail = qs('.hdr-actions a[href^="mailto:"], .contact-left a[href^="mailto:"], #header-email');
    if (headerEmail && getNested(dict, 'header.email')) {
      // some pages show full email anchor text; find any mailto anchor and update its text
      const mailAnchors = qsa('a[href^="mailto:"]');
      mailAnchors.forEach(a => { a.innerText = getNested(dict, 'header.email'); a.setAttribute('title', getNested(dict, 'header.email')); });
    }
    const headerCall = qsa('a[href^="tel:"]');
    if (headerCall && getNested(dict, 'header.call')) {
      headerCall.forEach(a => { a.innerText = getNested(dict, 'header.call'); a.setAttribute('title', getNested(dict, 'header.call')); });
    }

    // 3) update language labels in the language UI if present
    const langTextEl = qs('#langText') || qs('#langLabel') || qs('#langDisplay');
    const langFlagEl = qs('#langFlag');
    if (langTextEl) {
      // display currentLang uppercase as fallback
      langTextEl.textContent = (currentLang || 'en').toUpperCase();
    }
    if (langFlagEl) {
      const flags = { en: '🇬🇧', hi: '🇮🇳', ar: '🇦🇪' };
      langFlagEl.textContent = flags[currentLang] || '🌐';
    }
  }

  function initLanguageSelector() {
    const btn = qs('#langBtn') || qs('.lang-btn') || qs('#langButton');
    const panel = qs('#langPanel') || qs('#langMenu') || qs('.lang-menu');

    if (!btn) return;

    // ensure panel exists; if not, create simple fallback menu
    if (!panel) {
      console.warn('Language panel not found; creating simple dropdown.');
      const fallback = document.createElement('div');
      fallback.className = 'lang-menu';
      fallback.innerHTML = '<button data-lang="en" data-flag="🇬🇧">🇬🇧 English</button>'
        + '<button data-lang="hi" data-flag="🇮🇳">🇮🇳 हिन्दी</button>'
        + '<button data-lang="ar" data-flag="🇦🇪">🇦🇪 العربية</button>';
      btn.insertAdjacentElement('afterend', fallback);
    }

    const menu = qs('#langPanel') || qs('#langMenu') || qs('.lang-menu');

    // click to show/hide
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!menu) return;
      menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });

    // hook buttons inside menu
    if (menu) {
      menu.querySelectorAll('button[data-lang]').forEach(b => {
        b.addEventListener('click', async function () {
          const lang = b.getAttribute('data-lang') || 'en';
          const flag = b.getAttribute('data-flag') || '';
          currentLang = lang;
          // set UI
          const langTextEl = qs('#langText') || qs('#langLabel') || qs('#langDisplay');
          const langFlagEl = qs('#langFlag');
          if (langTextEl) langTextEl.textContent = lang.toUpperCase();
          if (langFlagEl && flag) langFlagEl.textContent = flag;

          // load and apply
          const dict = await loadLang(lang);
          if (dict) applyTranslations(dict);
          menu.style.display = 'none';
        });
      });

      // click outside closes menu
      document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) menu.style.display = 'none';
      });
    }

    // initial load of English by default
    (async function initialLoad() {
      // try to use stored lang
      try {
        const stored = localStorage.getItem('sbi_lang') || 'en';
        currentLang = stored || 'en';
      } catch (err) {
        currentLang = 'en';
      }
      const dict = await loadLang(currentLang);
      if (dict) applyTranslations(dict);
    })();
  }

  /* ==========================
     Contact Form handling
     - dynamic city population based on state
     - show/hide training block when interest = "Training"
     - when Send clicked, validate required fields and open mailto: with filled details
     - no backend (mail client opens)
     ========================== */
  function initContactForm() {
    const form = qs('#contactForm');
    if (!form) return;

    const stateSel = qs('#state', form);
    const citySel = qs('#city', form);
    const interestSel = qs('#interest', form);
    const trainingBlock = qs('#trainingBlock', form);
    const trainingSelect = qs('#trainingSelect', form);
    const sendBtn = qs('#sendBtn', form);

    // sample state->city mapping for main states present in HTML (add more if you want)
    const CITY_MAP = {
      'Bihar': ['Select city', 'Siwan', 'Patna', 'Gaya', 'Muzaffarpur'],
      'Uttar Pradesh': ['Select city', 'Lucknow', 'Kanpur', 'Varanasi', 'Ghaziabad'],
      'Delhi': ['Select city', 'New Delhi', 'North Delhi', 'South Delhi'],
      'Maharashtra': ['Select city', 'Mumbai', 'Pune', 'Nagpur', 'Nashik'],
      'Karnataka': ['Select city', 'Bengaluru', 'Mysore', 'Mangalore']
    };

    function populateCities(state) {
      if (!citySel) return;
      citySel.innerHTML = '';
      const cities = CITY_MAP[state] || ['Select city'];
      cities.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c === 'Select city' ? '' : c;
        opt.textContent = c;
        citySel.appendChild(opt);
      });
    }

    // initial populate if a state is already selected
    if (stateSel && citySel) {
      on(stateSel, 'change', function () {
        populateCities(stateSel.value);
      });
      // if the page had a preselected state, populate
      if (stateSel.value) populateCities(stateSel.value);
    }

    // interest toggling for training block
    if (interestSel && trainingBlock) {
      function toggleTrainingBlock() {
        const val = interestSel.value || '';
        if (/training/i.test(val)) trainingBlock.style.display = 'block';
        else trainingBlock.style.display = 'none';
      }
      on(interestSel, 'change', toggleTrainingBlock);
      toggleTrainingBlock();
    }

    // helper: simple validation for required fields we used earlier
    function validateForm() {
      const fullname = qs('#fullname', form);
      const state = stateSel;
      const city = citySel;
      const phone = qs('#phone', form);
      const interest = interestSel;

      if (!fullname || String(fullname.value || '').trim().length < 2) { alert('Please enter full name.'); fullname?.focus(); return false; }
      if (!state || !state.value) { alert('Please select state.'); state?.focus(); return false; }
      if (!city || !city.value) { alert('Please select city.'); city?.focus(); return false; }
      if (!phone || !phone.value || !/^\+?\d{7,15}$/.test(phone.value.replace(/\s+/g, ''))) { alert('Please enter a valid phone number (include country code if possible).'); phone?.focus(); return false; }
      if (!interest || !interest.value) { alert('Please select what you want (Career Guidance or Training).'); interest?.focus(); return false; }
      return true;
    }

    // compose mailto
    on(sendBtn, 'click', function () {
      if (!validateForm()) return;

      const fullname = qs('#fullname', form)?.value || '';
      const age = qs('#age', form)?.value || '';
      const state = stateSel?.value || '';
      const city = citySel?.value || '';
      const phone = qs('#phone', form)?.value || '';
      const whatsapp = qs('#whatsapp', form)?.value || '';
      const interest = interestSel?.value || '';
      const training = trainingSelect?.value || '';
      const message = qs('#message', form)?.value || '';

      const subject = encodeURIComponent('New enquiry from website: ' + fullname);
      let body = '';
      body += Full Name: ${escapeHtml(fullname)}%0D%0A;
      if (age) body += Age: ${escapeHtml(age)}%0D%0A;
      body += State: ${escapeHtml(state)}%0D%0A;
      body += City: ${escapeHtml(city)}%0D%0A;
      body += Phone: ${escapeHtml(phone)}%0D%0A;
      if (whatsapp) body += WhatsApp: ${escapeHtml(whatsapp)}%0D%0A;
      body += Interest: ${escapeHtml(interest)}%0D%0A;
      if (training) body += Training Selected: ${escapeHtml(training)}%0D%0A;
      if (message) body += %0D%0AMessage:%0D%0A${escapeHtml(message)}%0D%0A;

      // open mail client (info@skillsbuilderinstitute.com)
      const mailto = mailto:info@skillsbuilderinstitute.com?subject=${subject}&body=${encodeURIComponent(body)};
      // open in new tab/window to avoid popup blockers interfering with mailto on some browsers
      window.location.href = mailto;

      // optional: store quick text in localStorage for future prefill
      try {
        localStorage.setItem('sbi_last_enquiry', JSON.stringify({ name: fullname, phone: phone }));
      } catch (e) { /* ignore */ }
    });
  }

  /* ==========================
     Helpers: ensure social/follow links open safely in new tab
     ========================== */
  function initFollowLinks() {
    qsa('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (!href) return;
      // treat external links (absolute or starting with http) as external
      if (/^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
        // do not modify anchor that is intended to be same-tab (like internal anchors), but enforce target for external
        if (!a.target || a.target === '_self') {
          // only set target for external domains (not same-origin local files)
          try {
            const url = new URL(href, location.href);
            if (url.origin !== location.origin) a.setAttribute('target', '_blank');
          } catch (err) {
            // if URL parse fails, be conservative and set target blank for http(s)
            if (/^https?:\/\//i.test(href)) a.setAttribute('target', '_blank');
          }
        }
        // add rel noopener for security if opening new tab
        if (a.target === '_blank') a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /* ==========================
     Small UI tidy ups and initialisation
     ========================== */
  function initSmallUI() {
    // Hide any open panels on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        // hide language panel if present
        const langPanel = qs('#langPanel') || qs('#langMenu') || qs('.lang-menu');
        if (langPanel) langPanel.style.display = 'none';
        const explorePanel = qs('#explorePanel') || qs('.dropdown-panel') || qs('.dropdown-items');
        if (explorePanel) explorePanel.style.display = 'none';
      }
    });

    // ensure floating WhatsApp is visible and clickable (no JS needed; CSS handles it)
    const wa = qs('a[href*="wa.me"], .wa-float, .whatsapp-float');
    if (wa) wa.setAttribute('aria-label', 'WhatsApp chat');
  }

  /* ==========================
     Init everything on DOMContentLoaded
     ========================== */
  function init() {
    try {
      initExploreDropdown();
      initLanguageSelector();
      initContactForm();
      initFollowLinks();
      initSmallUI();
    } catch (err) {
      // safe fail: log to console, do not crash page
      console.error('builder.js init error', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
