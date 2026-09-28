const mainImage = document.getElementById("mainImage");
const imageContainer = document.getElementById("imageContainer");
const finalContainer = document.getElementById("finalContainer");
const mainTextContainer = document.getElementById("main-text-container");
const welcomeText = document.querySelectorAll(".welcome-text");
const scene = document.querySelector("#scene");
const images = [
  "./public/images/env_1_sequence.png",
  "./public/images/env_2_sequence.png",
  "./public/images/env_252_sequence.png",
  "./public/images/env_293_sequence.png",
  "./public/images/env3_sequence.png",
];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let started = false;

mainImage.addEventListener("click", () => {
  if (started) return;
  started = true;

  welcomeText.forEach((element, index) => {
    if (prefersReducedMotion) {
      element.classList.add("d-none");
      return;
    }

    element.classList.add("animate__animated", "animate__fadeOut");
    setTimeout(() => element.classList.add("d-none"), 500 + 50 * index);
  });

  if (prefersReducedMotion) {
    showFinalContainer();
    return;
  }

  mainImage.classList.add("fade-out");
  setTimeout(() => showImage(0), 220);
});

function showImage(index) {
  mainImage.src = images[index];
  mainImage.classList.remove("fade-out");

  if (index === 0) {
    mainImage.classList.remove("fade-in");
    void mainImage.offsetWidth;
    mainImage.classList.add("fade-in");
  }

  setTimeout(() => {
    if (index < images.length - 1) {
      showImage(index + 1);
    } else {
      showFinalContainer();
    }
  }, 135);
}

function showFinalContainer() {
  scene.classList.remove("scene-border");
  finalContainer.classList.remove("d-none");

  if (prefersReducedMotion) {
    imageContainer.classList.add("visually-hidden");
    mainTextContainer.classList.remove("d-none");
  } else {
    finalContainer.classList.add("animate__animated", "animate__fadeIn");
    imageContainer.classList.add("animate__animated", "animate__fadeOut");
    setTimeout(() => imageContainer.classList.add("visually-hidden"), 500);
    showMainTextTop();
  }

  playWeddingMusic();
}

function showMainTextTop() {
  setTimeout(() => {
    mainTextContainer.classList.remove("d-none");
    mainTextContainer.classList.add("animate__animated", "animate__fadeIn");
  }, 500);
}
