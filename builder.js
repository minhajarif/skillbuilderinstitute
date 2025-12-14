document.addEventListener("DOMContentLoaded", () => {

  /* ================= STATE → CITY ================= */
  const stateCityMap = {
    "Bihar": [
      "Patna","Gaya","Bhagalpur","Muzaffarpur","Darbhanga","Siwan",
      "Hajipur","Motihari","Bettiah","Sitamarhi","Madhubani"
    ],
    "Delhi": ["New Delhi","Dwarka"],
    "Uttar Pradesh": ["Lucknow","Kanpur","Noida","Varanasi"],
    "Maharashtra": ["Mumbai","Pune","Nagpur"],
    "West Bengal": ["Kolkata","Siliguri"]
  };

  const stateSelect = document.getElementById("state");
  const citySelect  = document.getElementById("city");

  if (stateSelect && citySelect) {

    // Load states
    Object.keys(stateCityMap).forEach(state => {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      stateSelect.appendChild(opt);
    });

    // On state change
    stateSelect.addEventListener("change", () => {
      citySelect.innerHTML = `<option value="">Select City</option>`;
      citySelect.disabled = true;

      if (!stateCityMap[stateSelect.value]) return;

      stateCityMap[stateSelect.value].forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
      });

      citySelect.disabled = false;
    });
  }

  /* ================= PURPOSE → TRAINING ================= */
  const purpose = document.getElementById("purpose");
  const trainingBlock = document.getElementById("trainingBlock");

  if (purpose && trainingBlock) {
    purpose.addEventListener("change", () => {
      trainingBlock.style.display =
        purpose.value === "training" ? "block" : "none";
    });
  }

  /* ================= TRAINING TYPE → PROGRAM ================= */
  const programs = {
    skill: ["Electrician","Plumber","Welder"],
    professional: ["HR","Accounts","Sales"],
    engineering: ["Civil","Mechanical"],
    programming: ["Web Development","Python","Java"],
    softskill: ["Communication","Interview Skills"]
  };

  const trainingType = document.getElementById("trainingType");
  const subCategory  = document.getElementById("subCategory");

  if (trainingType && subCategory) {
    trainingType.addEventListener("change", () => {
      subCategory.innerHTML = `<option value="">Select Program</option>`;
      (programs[trainingType.value] || []).forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        subCategory.appendChild(opt);
      });
    });
  }

});