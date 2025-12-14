document.addEventListener("DOMContentLoaded", () => {

  /* ================= STATE → CITY ================= */
  const stateCityMap = {
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Katihar", "Munger", "Chapra", "Sasaram", "Hajipur", "Siwan", "Motihari", "Bettiah", "Sitamarhi", "Madhubani", "Samastipur", "Nalanda (Bihar Sharif)", "Jehanabad", "Aurangabad", "Nawada", "Lakhisarai", "Sheikhpura", "Jamui", "Buxar", "Rohtas", "Kaimur (Bhabua)", "Gopalganj", "Supaul", "Madhepura", "Saharsa", "Araria", "Kishanganj", "Khagaria", "West Champaran", "East Champaran", "Vaishali", "Banka"],
    "Delhi": ["New Delhi","Dwarka"],
    "Uttar Pradesh": ["Agra","Aligarh","Prayagraj","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
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
    skill: ["Electrician","Plumber","Welder","Carpenter","Pipefitter","Steel Fixer","Store Keeper","Helper","AC Technician","Cleaner","Mason","Painter"],
    professional: ["HR","Accounts","Sales","BPO","Data Entry","Manager","Business Analytics","Product Analyst","Supervisor","Excel","Tally Calling"],
    engineering: ["Civil","Mechanical","Electronic","Electrical","Mobile","Project Engineer","Data Analytics","Product Engineer"],
    programming: ["Frontend","Backend",Full Stack","Web Development","Node.js Developer","React.js Developer","Artificial Intelligence","Machine Learning","Python Developer","Java Developer","Cyber Security"],
    softskill: ["Communication","Interview Skills","Public Speaking","Presentation Skill","Group Discussion (GD)","Gesture"]
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