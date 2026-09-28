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
const scrollTrack = document.getElementById("envelopeScrollTrack");
const scrollPrompt = document.getElementById("scrollPrompt");

let started = false;
let finished = false;
let currentFrame = -1;
let scrollUpdatePending = false;
let scrollSettleActive = false;
let scrollSettleTimer;

function releaseScrollSettle(delay = 220) {
  clearTimeout(scrollSettleTimer);
  scrollSettleTimer = setTimeout(() => {
    scrollSettleActive = false;
  }, delay);
}

function holdScrollAtSectionStart(event) {
  if (!scrollSettleActive) return;
  if (event.cancelable) event.preventDefault();
  releaseScrollSettle();
}

function alignFinalContainer() {
  const finalTop = finalContainer.getBoundingClientRect().top + window.scrollY;
  if (Math.abs(window.scrollY - finalTop) > 1) {
    window.scrollTo(0, finalTop);
  }
}

window.addEventListener("wheel", holdScrollAtSectionStart, { passive: false });
window.addEventListener("keydown", (event) => {
  if (!scrollSettleActive || !["ArrowDown", "PageDown", " ", "End"].includes(event.key)) return;
  event.preventDefault();
  releaseScrollSettle();
}, { capture: true });

function hideWelcomeText() {
  welcomeText.forEach((element, index) => {
    if (prefersReducedMotion) {
      element.classList.add("d-none");
      return;
    }

    element.classList.add("animate__animated", "animate__fadeOut");
    setTimeout(() => element.classList.add("d-none"), 500 + 50 * index);
  });
}

function updateEnvelopeFromScroll() {
  scrollUpdatePending = false;
  if (finished) return;

  const scrollDistance = scrollTrack.offsetHeight - window.innerHeight;
  if (scrollDistance <= 0) return;

  const trackTop = scrollTrack.getBoundingClientRect().top + window.scrollY;
  const progress = Math.max(0, Math.min(1, (window.scrollY - trackTop) / scrollDistance));
  if (progress <= 0) return;

  if (!started) {
    started = true;
    hideWelcomeText();
    scrollPrompt.classList.add("is-hidden");
  }

  const frameIndex = Math.min(images.length - 1, Math.floor(progress * images.length));
  if (frameIndex !== currentFrame) {
    currentFrame = frameIndex;
    mainImage.src = images[frameIndex];
  }

  if (progress >= 1) {
    finished = true;
    scrollSettleActive = true;
    releaseScrollSettle(500);
    scrollTrack.classList.add("is-open");
    showFinalContainer();
    window.requestAnimationFrame(() => {
      alignFinalContainer();
      window.requestAnimationFrame(alignFinalContainer);
    });
    setTimeout(alignFinalContainer, 100);
  }
}

window.addEventListener("scroll", () => {
  if (scrollSettleActive) {
    releaseScrollSettle();
    alignFinalContainer();
    return;
  }
  if (scrollUpdatePending || finished) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(updateEnvelopeFromScroll);
}, { passive: true });

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
