// Initialisation de la carte centrée sur Paris
const map = L.map('map').setView([48.8566, 2.3522], 12);

// Fond de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Zone d'action autour d'Aix-en-Provence (30 km)
const zoneAction = L.circle([43.5444, 5.0261], {
  color: '#FFD700',
  fillColor: '#FFD70055',
  fillOpacity: 0.5,
  radius: 30000
}).addTo(map);

zoneAction.bindPopup("Zone d'action ste BLANCHE/CARE (30 km autour d'Aix-en-Provence)").openPopup();

// Effet de transparence du header au scroll
window.addEventListener("scroll", () => {
  const header = document.getElementById("defilement_header");
  header.classList.toggle("header-transparence", window.scrollY > 50);
});

// Carrousel d'images
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelector(".slides");
  const images = document.querySelectorAll(".slides img");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");

  let index = 0;
  let autoSlideInterval;

  function updateSlide() {
    slides.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % images.length;
    updateSlide();
  }

  function prevSlide() {
    index = (index - 1 + images.length) % images.length;
    updateSlide();
  }

  next.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  prev.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  startAutoSlide();
});
