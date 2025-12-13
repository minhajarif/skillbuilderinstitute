/* ================= HOME PAGE SLIDER ================= */
/* Safe: sirf tab chalega jab .slide exist kare */

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let index = 0;

  if (slides.length > 0) {
    setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, 5000);
  }
});


/* ================= CONTACT FORM LOGIC ================= */

/* STATE → CITY */
const citiesByState = {
  "Bihar": ["Siwan", "Patna", "Gaya"],
  "Uttar Pradesh": ["Kanpur", "Lucknow", "Noida"],
  "Delhi": ["New Delhi"]
};

const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");

if (stateSelect && citySelect) {
  stateSelect.addEventListener("change", function () {
    citySelect.innerHTML = '<option value="">Select City</option>';
    citySelect.disabled = true;

    if (citiesByState[this.value]) {
      citiesByState[this.value].forEach(city => {
        const option = document.createElement("option");
        option.textContent = city;
        option.value = city;
        citySelect.appendChild(option);
      });
      citySelect.disabled = false;
    }
  });
}


/* I WANT → TRAINING BLOCK */
const purposeSelect = document.getElementById("purpose");
const trainingBlock = document.getElementById("trainingBlock");

if (purposeSelect && trainingBlock) {
  purposeSelect.addEventListener("change", function () {
    trainingBlock.style.display =
      this.value === "training" ? "block" : "none";
  });
}


/* TRAINING TYPE → SUB PROGRAM */
const programsByType = {
  skill: ["Electrician", "Plumber", "Welder"],
  professional: ["HR", "Accounts", "Sales"],
  engineering: ["Civil", "Mechanical"],
  programming: ["Web Development", "Python", "Java"],
  softskill: ["Communication Skills", "Interview Skills"]
};

const trainingTypeSelect = document.getElementById("trainingType");
const subCategorySelect = document.getElementById("subCategory");

if (trainingTypeSelect && subCategorySelect) {
  trainingTypeSelect.addEventListener("change", function () {
    subCategorySelect.innerHTML =
      '<option value="">Select Program</option>';

    if (programsByType[this.value]) {
      programsByType[this.value].forEach(program => {
        const option = document.createElement("option");
        option.textContent = program;
        option.value = program;
        subCategorySelect.appendChild(option);
      });
    }
  });
}

/* ===============================
   COMMON BUILDER.JS
   Works for: Home, About, Contact
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let index = 0;
  slides[index].classList.add("active");

  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 4000);
});

/* ---------- CONTACT FORM LOGIC ---------- */
document.addEventListener("DOMContentLoaded", function () {

  /* ===== STATE → CITY DATA (26+ STATES) ===== */
  const stateCityMap = {
    "Andhra Pradesh": ["Vijayawada", "Visakhapatnam", "Guntur"],
    "Arunachal Pradesh": ["Itanagar"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
    "Bihar": ["Patna", "Siwan", "Gaya", "Muzaffarpur"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini"],
    "Goa": ["Panaji", "Margao"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat"],
    "Himachal Pradesh": ["Shimla", "Solan"],
    "Jharkhand": ["Ranchi", "Jamshedpur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli"],
    "Kerala": ["Kochi", "Thiruvananthapuram"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Odisha": ["Bhubaneswar", "Cuttack"],
    "Punjab": ["Ludhiana", "Amritsar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana": ["Hyderabad", "Warangal"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Varanasi"],
    "Uttarakhand": ["Dehradun", "Haridwar"],
    "West Bengal": ["Kolkata", "Siliguri"]
  };

  /* ===== TRAINING DATA ===== */
  const trainingPrograms = {
    skill: [
      "Electrician",
      "Plumber",
      "Welder",
      "Carpenter",
      "Painter",
      "Helper"
    ],
    professional: [
      "HR Executive",
      "Accounts Executive",
      "Office Administration",
      "Sales Executive",
      "Digital Marketing"
    ],
    engineering: [
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering"
    ],
    programming: [
      "Web Development",
      "Python Programming",
      "Java Programming",
      "Full Stack Development"
    ],
    softskill: [
      "Communication Skills",
      "Interview Preparation",
      "Personality Development",
      "Spoken English"
    ]
  };

  /* ===== ELEMENTS ===== */
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");
  const purposeSelect = document.getElementById("purpose");
  const trainingBlock = document.getElementById("trainingBlock");
  const trainingType = document.getElementById("trainingType");
  const subCategory = document.getElementById("subCategory");

  /* ===== STATE → CITY ===== */
  if (stateSelect && citySelect) {
    stateSelect.addEventListener("change", function () {
      citySelect.innerHTML = `<option value="">Select City</option>`;
      citySelect.disabled = true;

      if (!this.value || !stateCityMap[this.value]) return;

      stateCityMap[this.value].forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
      });

      citySelect.disabled = false;
    });
  }

  /* ===== PURPOSE (CAREER / TRAINING) ===== */
  if (purposeSelect && trainingBlock) {
    purposeSelect.addEventListener("change", function () {
      if (this.value === "training") {
        trainingBlock.style.display = "block";
      } else {
        trainingBlock.style.display = "none";
        trainingType.value = "";
        subCategory.innerHTML = `<option value="">Select Program</option>`;
      }
    });
  }

  /* ===== TRAINING TYPE → PROGRAMS ===== */
  if (trainingType && subCategory) {
    trainingType.addEventListener("change", function () {
      subCategory.innerHTML = `<option value="">Select Program</option>`;

      if (!trainingPrograms[this.value]) return;

      trainingPrograms[this.value].forEach(program => {
        const opt = document.createElement("option");
        opt.value = program;
        opt.textContent = program;
        subCategory.appendChild(opt);
      });
    });
  }

});

document.addEventListener("DOMContentLoaded", () => {

  /* ================= STATE → CITY DATA ================= */
  const stateCityMap = {
    "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur"],
    "Assam": ["Guwahati","Silchar"],
    "Bihar": ["Patna","Siwan","Gaya","Muzaffarpur"],
    "Chhattisgarh": ["Raipur","Bilaspur"],
    "Delhi": ["New Delhi"],
    "Gujarat": ["Ahmedabad","Surat","Vadodara"],
    "Haryana": ["Gurugram","Faridabad","Panipat"],
    "Himachal Pradesh": ["Shimla","Solan"],
    "Jharkhand": ["Ranchi","Dhanbad"],
    "Karnataka": ["Bengaluru","Mysuru"],
    "Kerala": ["Kochi","Thiruvananthapuram"],
    "Madhya Pradesh": ["Bhopal","Indore"],
    "Maharashtra": ["Mumbai","Pune","Nagpur"],
    "Odisha": ["Bhubaneswar","Cuttack"],
    "Punjab": ["Ludhiana","Amritsar"],
    "Rajasthan": ["Jaipur","Jodhpur"],
    "Tamil Nadu": ["Chennai","Coimbatore"],
    "Telangana": ["Hyderabad","Warangal"],
    "Uttar Pradesh": ["Lucknow","Kanpur","Noida","Varanasi"],
    "Uttarakhand": ["Dehradun","Haridwar"],
    "West Bengal": ["Kolkata","Howrah"]
  };

  const stateSelect = document.getElementById("state");
  const citySelect  = document.getElementById("city");

  /* ================= LOAD STATES ================= */
  Object.keys(stateCityMap).forEach(state => {
    const opt = document.createElement("option");
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });

  /* ================= STATE CHANGE ================= */
  stateSelect.addEventListener("change", () => {
    citySelect.innerHTML = `<option value="">Select City</option>`;
    citySelect.disabled = true;

    if (!stateSelect.value) return;

    stateCityMap[stateSelect.value].forEach(city => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });

    citySelect.disabled = false;
  });

  /* ================= PURPOSE ================= */
  const purpose = document.getElementById("purpose");
  const trainingBlock = document.getElementById("trainingBlock");

  purpose.addEventListener("change", () => {
    trainingBlock.style.display =
      purpose.value === "training" ? "block" : "none";
  });

  /* ================= TRAINING PROGRAMS ================= */
  const programs = {
    skill: ["Electrician","Plumber","Welder","Fitter","Helper"],
    professional: ["HR Executive","Accounts","Sales"],
    engineering: ["Civil","Mechanical","Electrical"],
    programming: ["Web Development","Python","Java"],
    softskill: ["Communication","Interview Skills"]
  };

  const trainingType = document.getElementById("trainingType");
  const subCategory  = document.getElementById("subCategory");

  trainingType.addEventListener("change", () => {
    subCategory.innerHTML = `<option value="">Select Program</option>`;
    (programs[trainingType.value] || []).forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      subCategory.appendChild(opt);
    });
  });

});

<script>
  let slides = document.querySelectorAll(".slide");
  let index = 0;

  function showSlide(){
    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");
    index = (index + 1) % slides.length;
  }

  setInterval(showSlide, 3000);

  // Dropdown
  const exploreLi = document.getElementById("exploreLi");
  const exploreDropdown = document.getElementById("exploreDropdown");

  exploreLi.addEventListener("mouseenter", () => exploreDropdown.style.display = "block");
  exploreLi.addEventListener("mouseleave", () => exploreDropdown.style.display = "none");
</script>

