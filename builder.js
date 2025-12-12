/* builder.js
   Master site JS for Skills Builder Institute
   - Replace FORMSPREE_ENDPOINT value with your Formspree endpoint (e.g. https://formspree.io/f/yourId)
   - If FORMSPREE_ENDPOINT === '' -> mailto fallback will be used
   - Handles: sliders, dropdowns, language demo, state->city, training subcategories, contact form submit & validation
*/

(function () {
  'use strict';

  /* ====== CONFIG ====== */
  // Put your Formspree endpoint here. Example: "https://formspree.io/f/mypageid"
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/yourFormID'; // <-- replace with your endpoint
  // The 'to' email fallback for mailto (used if FORMSPREE_ENDPOINT is empty or fetch fails)
  const CONTACT_EMAIL = 'info@skillsbuilderinstitute.com';

  /* ====== UTILITIES ====== */
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from((root || document).querySelectorAll(sel)); }
  function safeText(s) { return (s === null || s === undefined) ? '' : String(s); }

  /* ====== YEAR ====== */
  (function setYear() {
    const yEl = qs('#year');
    if (yEl) yEl.textContent = new Date().getFullYear();
  })();

  /* ====== NAV DROPDOWN (Explore) ====== */
  (function dropdowns() {
    const exploreLi = qs('#exploreLi');
    const exploreDropdown = qs('#exploreDropdown');
    if (exploreLi && exploreDropdown) {
      exploreLi.addEventListener('mouseenter', () => exploreDropdown.style.display = 'block');
      exploreLi.addEventListener('mouseleave', () => exploreDropdown.style.display = 'none');
      // keyboard accessible
      const a = exploreLi.querySelector('a');
      if (a) {
        a.addEventListener('focus', () => exploreDropdown.style.display = 'block');
        a.addEventListener('blur', () => {
          // small timeout to allow focus to move into dropdown
          setTimeout(() => {
            if (!exploreLi.contains(document.activeElement)) exploreDropdown.style.display = 'none';
          }, 150);
        });
      }
    }
  })();

  /* ====== LANGUAGE SELECT DEMO ====== */
  (function langDemo() {
    const sel = qs('#langSelect');
    if (!sel) return;
    sel.addEventListener('change', function () {
      const val = this.value;
      if (!val || val === 'en') {
        // do nothing
        this.value = 'en';
        return;
      }
      if (val === 'hi') {
        alert('Hindi selected (demo). Site content remains English until full translation is added.');
      } else if (val === 'ar') {
        alert('Arabic selected (demo). Site content remains English until full translation is added.');
      } else {
        alert('Language selected: ' + val);
      }
      // keep UI in English as requested
      this.value = 'en';
    });
  })();

  /* ====== GENERIC SLIDER INITIALIZER ======
     It supports both slider types used in pages:
     - index.html: #slides (transform X)
     - explore page: .slide elements with active class (opacity)
  ===========================================*/
  (function sliders() {
    // index-style slides (container transform)
    const slidesContainer = qs('#slides');
    if (slidesContainer) {
      const slides = Array.from(slidesContainer.children);
      let idx = 0, timer;
      const total = slides.length;
      const dots = qsa('#dots .dot');

      function goTo(i) {
        idx = ((i % total) + total) % total;
        slidesContainer.style.transform = `translateX(${-idx * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');
        reset();
      }
      function next() { goTo(idx + 1); }
      function prev() { goTo(idx - 1); }
      function reset() {
        clearTimeout(timer);
        timer = setTimeout(next, 5000);
      }
      // attach controls if present
      const nextBtn = qs('#next');
      const prevBtn = qs('#prev');
      if (nextBtn) nextBtn.addEventListener('click', next);
      if (prevBtn) prevBtn.addEventListener('click', prev);
      qsa('#dots .dot').forEach(d => d.addEventListener('click', () => goTo(Number(d.dataset.index))));
      // pause on hover
      const hero = qs('.hero');
      if (hero) {
        hero.addEventListener('mouseenter', () => clearTimeout(timer));
        hero.addEventListener('mouseleave', reset);
      }
      reset();
    }

    // explore-style slides: .slide with .active toggled (opacity fade)
    (function exploreSlides() {
      const slideEls = qsa('.slider-wrapper .slide');
      if (!slideEls || slideEls.length === 0) return;
      let sidx = 0;
      function show() {
        slideEls.forEach((el, i) => el.classList.toggle('active', i === sidx));
        sidx = (sidx + 1) % slideEls.length;
      }
      // start and loop every 3s
      show();
      setInterval(show, 3000);
    })();
  })();

  /* ====== STATE -> CITY MAPPING (same as earlier) ====== */
  const citiesByState = {
    "Andhra Pradesh":["Vijayawada","Visakhapatnam","Guntur"],
    "Arunachal Pradesh":["Itanagar"],
    "Assam":["Guwahati","Silchar"],
    "Bihar":["Patna","Siwan","Gopalganj"],
    "Chhattisgarh":["Raipur","Bhilai"],
    "Goa":["Panaji","Margao"],
    "Gujarat":["Ahmedabad","Surat","Vadodara"],
    "Haryana":["Gurugram","Faridabad","Panipat"],
    "Himachal Pradesh":["Shimla","Dharamshala"],
    "Jharkhand":["Ranchi","Jamshedpur"],
    "Karnataka":["Bengaluru","Mysuru","Mangalore"],
    "Kerala":["Kochi","Thiruvananthapuram"],
    "Madhya Pradesh":["Bhopal","Indore"],
    "Maharashtra":["Mumbai","Pune","Nagpur"],
    "Manipur":["Imphal"],
    "Meghalaya":["Shillong"],
    "Mizoram":["Aizawl"],
    "Nagaland":["Kohima"],
    "Odisha":["Bhubaneswar","Cuttack"],
    "Punjab":["Ludhiana","Amritsar","Jalandhar"],
    "Rajasthan":["Jaipur","Jodhpur","Udaipur"],
    "Sikkim":["Gangtok"],
    "Tamil Nadu":["Chennai","Coimbatore","Madurai"],
    "Telangana":["Hyderabad","Warangal"],
    "Tripura":["Agartala"],
    "Uttar Pradesh":["Kanpur","Lucknow","Varanasi","Agra"],
    "Uttarakhand":["Dehradun","Haridwar"],
    "West Bengal":["Kolkata","Howrah"],
    "Delhi (NCT)":["New Delhi"],
    "Puducherry":["Puducherry"],
    "Other":["Other City"]
  };

  (function bindStateCity() {
    const stateEl = qs('#state');
    const cityEl = qs('#city');
    if (!stateEl || !cityEl) return;
    stateEl.addEventListener('change', function () {
      const s = this.value;
      cityEl.innerHTML = '';
      if (!s || !citiesByState[s]) {
        cityEl.disabled = true;
        cityEl.innerHTML = '<option value="">-- Select State First --</option>';
        return;
      }
      cityEl.disabled = false;
      const opts = citiesByState[s];
      cityEl.innerHTML = '<option value="">-- Select City --</option>';
      opts.forEach(c => {
        const o = document.createElement('option'); o.value = c; o.textContent = c;
        cityEl.appendChild(o);
      });
    });
  })();

  /* ====== TRAINING categories -> subPrograms mapping ====== */
  const subPrograms = {
    "skill": ["Electrician","Plumber","Welder","Carpenter","AC Technician","Pipe Fitter","Mason","Painter","Store Keeper","Helper"],
    "professional": ["HR Trainee","Payroll Executive","Admin Executive","Store Keeper","Sales Executive","Tally","Business Analytics","Digital Marketing","Call Centre","Data Entry"],
    "engineer": ["Civil Engineer","Electrical Engineer","Mechanical Engineer","Electronics Engineer","Project Engineer","Product Engineer","Mobile Engineer"],
    "programmer": ["Web Development","Frontend Developer","Backend Developer","Full Stack","Node.js Developer","React.js","AI / ML Basics","Cyber Security"],
    "softskill": ["Communication","Public Speaking","Presentation Skills","Group Discussion","GD & Interview Skills"]
  };

  (function bindTrainingSelects() {
    const purposeEl = qs('#purpose');
    const trainingBlock = qs('#trainingBlock');
    const trainingTypeEl = qs('#trainingType');
    const subCategoryEl = qs('#subCategory');
    if (!purposeEl) return;

    purposeEl.addEventListener('change', function () {
      if (this.value === 'training') {
        if (trainingBlock) trainingBlock.style.display = 'block';
        if (trainingTypeEl) trainingTypeEl.setAttribute('required', 'required');
        if (subCategoryEl) subCategoryEl.setAttribute('required', 'required');
      } else {
        if (trainingBlock) trainingBlock.style.display = 'none';
        if (trainingTypeEl) trainingTypeEl.removeAttribute('required');
        if (subCategoryEl) subCategoryEl.removeAttribute('required');
        if (trainingTypeEl) trainingTypeEl.value = '';
        if (subCategoryEl) subCategoryEl.innerHTML = '<option value="">-- Select program --</option>';
      }
    });

    if (trainingTypeEl) {
      trainingTypeEl.addEventListener('change', function () {
        const v = this.value;
        if (!subCategoryEl) return;
        subCategoryEl.innerHTML = '<option value="">-- Select program --</option>';
        if (!v || !subPrograms[v]) return;
        subPrograms[v].forEach(p => {
          const op = document.createElement('option');
          op.value = p;
          op.textContent = p;
          subCategoryEl.appendChild(op);
        });
      });
    }
  })();

  /* ====== CONTACT FORM HANDLER (Formspree) ======
     - Validates required fields
     - If FORMSPREE_ENDPOINT is set, it will POST the form using fetch(FormData)
     - On success shows thank box and clears the form (optional)
     - On failure (or if endpoint is empty) it falls back to mailto:
  ==============================================*/
  (function contactFormHandler() {
    const form = qs('#contactForm');
    if (!form) return;

    const clearBtn = qs('#clearBtn');
    const thankbox = qs('#thankbox');

    function showThank(msg) {
      if (!thankbox) return;
      thankbox.textContent = msg || 'Thank you! Your request has been submitted.';
      thankbox.style.display = 'block';
      setTimeout(() => { thankbox.style.display = 'none'; }, 7000);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        form.reset();
        const cityEl = qs('#city');
        if (cityEl) { cityEl.innerHTML = '<option value="">-- Select State First --</option>'; cityEl.disabled = true; }
        const trainingBlock = qs('#trainingBlock');
        if (trainingBlock) trainingBlock.style.display = 'none';
        const subCategoryEl = qs('#subCategory');
        if (subCategoryEl) subCategoryEl.innerHTML = '<option value="">-- Select program --</option>';
        if (thankbox) thankbox.style.display = 'none';
      });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic required validation -- mirror HTML required but with messages
      const nameEl = qs('#name'); const stateEl = qs('#state'); const cityEl = qs('#city');
      const phoneEl = qs('#phone'); const purposeEl = qs('#purpose');
      if (!nameEl || !stateEl || !cityEl || !phoneEl || !purposeEl) {
        alert('Form structure error. Please contact admin.');
        return;
      }
      if (!nameEl.value.trim()) { alert('Please enter your full name.'); nameEl.focus(); return; }
      if (!stateEl.value) { alert('Please select your State.'); stateEl.focus(); return; }
      if (!cityEl.value) { alert('Please select your City.'); cityEl.focus(); return; }
      if (!phoneEl.value.trim()) { alert('Please enter your calling phone number.'); phoneEl.focus(); return; }
      if (!purposeEl.value) { alert('Please select whether you want Career Guidance or Training.'); purposeEl.focus(); return; }

      // If training -> require category and program
      const purposeVal = purposeEl.value;
      const trainingTypeEl = qs('#trainingType');
      const subCategoryEl = qs('#subCategory');
      if (purposeVal === 'training') {
        if (!trainingTypeEl || !trainingTypeEl.value) { alert('Please select a training category.'); if (trainingTypeEl) trainingTypeEl.focus(); return; }
        if (!subCategoryEl || !subCategoryEl.value) { alert('Please select specific program.'); if (subCategoryEl) subCategoryEl.focus(); return; }
      }

      // prepare data
      const formData = new FormData(form);
      // add some extra fields (human readable)
      formData.append('_subject', `Website Contact: ${nameEl.value.trim()}`);
      formData.append('_source', location.href);

      // If FORMSPREE_ENDPOINT is configured -> use it
      if (FORMSPREE_ENDPOINT && FORMSPREE_ENDPOINT.trim() !== '') {
        try {
          // Formspree accepts form-encoded POST
          const resp = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
              // NOTE: do not set Content-Type; browser will set multipart/form-data with boundary
              'Accept': 'application/json'
            }
          });

          if (resp.ok) {
            showThank('Thank you — your message was sent. We will contact you soon.');
            // optional: clear form
            form.reset();
            const cityEl2 = qs('#city'); if (cityEl2) { cityEl2.innerHTML = '<option value="">-- Select State First --</option>'; cityEl2.disabled = true; }
            const trainingBlock = qs('#trainingBlock'); if (trainingBlock) trainingBlock.style.display = 'none';
          } else {
            // try to parse JSON error message
            let json;
            try { json = await resp.json(); } catch (err) { json = null; }
            const errMsg = (json && (json.error || json.message)) ? json.error || json.message : `Form submission failed (status ${resp.status}).`;
            alert('Formspree error: ' + errMsg + '\nFalling back to mail client.');
            // fallback
            fallbackMail(form);
          }
        } catch (err) {
          console.error('Formspree request failed', err);
          alert('Network error while sending form. Falling back to mail client.');
          fallbackMail(form);
        }
      } else {
        // No Formspree endpoint configured -> fallback to mailto
        fallbackMail(form);
      }
    });

    // fallback: generate a mailto: link prefilled with form data and open it
    function fallbackMail(formEl) {
      const d = new FormData(formEl);
      const name = safeText(d.get('name'));
      const age = safeText(d.get('age'));
      const state = safeText(d.get('state'));
      const city = safeText(d.get('city'));
      const phone = safeText(d.get('phone'));
      const whatsapp = safeText(d.get('whatsapp'));
      const purpose = safeText(d.get('purpose'));
      const trainingCategory = safeText(d.get('trainingType'));
      const program = safeText(d.get('subCategory'));
      const message = safeText(d.get('message'));

      let body = '';
      body += `Name: ${name}\n`;
      if (age) body += `Age: ${age}\n`;
      body += `State: ${state}\nCity: ${city}\n`;
      body += `Phone: ${phone}\nWhatsApp: ${whatsapp}\n`;
      body += `Purpose: ${purpose}\n`;
      if (purpose === 'training') {
        body += `Training category: ${trainingCategory}\nProgram: ${program}\n`;
      }
      if (message) body += `Message: ${message}\n`;
      body += `\n-- Sent from website contact form`;

      const subject = encodeURIComponent(`Website Contact: ${name || 'New Lead'}`);
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;

      // open mail client
      window.location.href = mailto;
      showThank('A draft email has been prepared in your mail client. Please send it to complete the request.');
    }

  })();

  /* ====== OPTIONAL: Expose a small global for debugging in console (if needed) */
  window.SBI = window.SBI || {};
  window.SBI.builder = {
    FORMSPREE_ENDPOINT,
    citiesByStateKeys: Object.keys(citiesByState)
  };

})(); // end builder.js