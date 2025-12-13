const exploreLi = document.getElementById("exploreLi");
const exploreDropdown = document.getElementById("exploreDropdown");

if (exploreLi && exploreDropdown) {
  exploreLi.addEventListener("mouseenter", () => {
    exploreDropdown.style.display = "block";
  });

  exploreLi.addEventListener("mouseleave", () => {
    exploreDropdown.style.display = "none";
  });
}