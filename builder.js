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