const mainImage = document.getElementById("mainImage");
const imageContainer = document.getElementById("imageContainer");
const finalContainer = document.getElementById("finalContainer");
const mainTextContainer = document.getElementById("main-text-container");
const welcomeText = document.querySelectorAll(".welcome-text");
const scene = document.querySelector("#scene");
const images = [
  "./public/images/env_1_sequence.webp?v=1",
  "./public/images/env_2_sequence.webp?v=1",
  "./public/images/env_252_sequence.webp?v=1",
  "./public/images/env_293_sequence.webp?v=1",
  "./public/images/env3_sequence.webp?v=1",
];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollTrack = document.getElementById("envelopeScrollTrack");
const scrollPrompt = document.getElementById("scrollPrompt");
const envelopePromptText = document.getElementById("envelopePromptText");
const envelopeLoadingStatus = document.getElementById("envelopeLoadingStatus");

// El botón conserva acceso con Enter/Espacio; la imagen también acepta un toque.
scrollPrompt.addEventListener("click", startEnvelopeOpening);
mainImage.addEventListener("click", startEnvelopeOpening);

let started = false;
let finished = false;
let touchStartY = null;
let scrollSettleActive = false;
let touchInProgress = false;
let scrollSettleTimer;

const initialLoader = document.getElementById("envelopeInitialLoader");
initialLoader.addEventListener("click", startEnvelopeOpening);

// El indicador ocupa visualmente el espacio reservado por la imagen, sin moverla.
function positionInitialLoader() {
  initialLoader.style.left = `${mainImage.offsetLeft + mainImage.offsetWidth / 2}px`;
  initialLoader.style.top = `${mainImage.offsetTop + mainImage.offsetHeight * 0.65}px`;
}
const initialResizeObserver = new ResizeObserver(positionInitialLoader);
initialResizeObserver.observe(mainImage);
window.addEventListener("resize", positionInitialLoader);
positionInitialLoader();

async function prepareInitialEnvelope() {
  let timeout;
  const decoded = await Promise.race([
    mainImage.decode().then(() => true).catch(() => false),
    new Promise(resolve => { timeout = setTimeout(() => resolve(false), 8000); }),
  ]);
  clearTimeout(timeout);
  initialLoader.hidden = true;
  initialResizeObserver.disconnect();
  window.removeEventListener("resize", positionInitialLoader);
  if (decoded) {
    mainImage.classList.remove("envelope-preparing");
    if (!prefersReducedMotion) {
      // La entrada comienza después de decodificar, nunca durante la descarga.
      await new Promise(resolve => {
        let animationTimeout;
        const complete = () => {
          clearTimeout(animationTimeout);
          mainImage.removeEventListener("animationend", complete);
          resolve();
        };
        mainImage.addEventListener("animationend", complete, { once: true });
        mainImage.classList.add("animate__animated", "animate__bounceIn", "animate__slower");
        animationTimeout = setTimeout(complete, 3200);
      });
      mainImage.classList.remove("animate__animated", "animate__bounceIn", "animate__slower");
    }
  } else {
    envelopePromptText.textContent = "Toca para ver la invitación";
    envelopeLoadingStatus.textContent = "No se pudo cargar el sobre. Puedes abrir la invitación.";
  }
  scrollPrompt.classList.remove("is-hidden");
  return decoded;
}
const initialEnvelopeReady = prepareInitialEnvelope();

// La restauración de scroll al recargar no representa un gesto de apertura.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
alignFinalContainer();
window.addEventListener("pageshow", () => {
  if (!started) alignFinalContainer();
});

function releaseScrollSettle(delay = 220) {
  clearTimeout(scrollSettleTimer);
  scrollSettleTimer = setTimeout(() => {
    if (!finished || touchInProgress) return;
    scrollSettleActive = false;
    if (finished) alignFinalContainer();
  }, delay);
}

function holdScrollAtSectionStart(event) {
  if (!scrollSettleActive) return;
  if (event.cancelable) event.preventDefault();
  releaseScrollSettle();
}

function alignFinalContainer() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

window.addEventListener("wheel", (event) => {
  if (!started && event.deltaY !== 0 && !event.ctrlKey) startEnvelopeOpening();
  holdScrollAtSectionStart(event);
}, { passive: false });
window.addEventListener("touchstart", (event) => {
  touchInProgress = true;
  touchStartY = event.touches.length === 1 ? event.touches[0].clientY : null;
}, { passive: true });
window.addEventListener("touchmove", (event) => {
  if (!started && touchStartY !== null && event.touches.length === 1 &&
      touchStartY - event.touches[0].clientY > 12) {
    startEnvelopeOpening();
  }
  if (!scrollSettleActive) return;
  if (event.cancelable) event.preventDefault();
}, { passive: false });
window.addEventListener("touchend", () => {
  touchInProgress = false;
  if (scrollSettleActive) releaseScrollSettle();
}, { passive: true });
window.addEventListener("touchcancel", () => {
  touchInProgress = false;
  if (scrollSettleActive) releaseScrollSettle();
}, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Home", "End"].includes(event.key)) return;
  if (!started) startEnvelopeOpening();
  if (!scrollSettleActive) return;
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

// Un solo gesto reproduce toda la secuencia, sin depender de más scroll.
async function startEnvelopeOpening() {
  if (started || finished) return;
  started = true;
  scrollSettleActive = true;
  scrollPrompt.disabled = true;
  scrollPrompt.setAttribute("aria-busy", "true");
  // Una interacción durante la preparación queda pendiente y se ejecuta una vez.
  const initialImageAvailable = await initialEnvelopeReady;

  if (!prefersReducedMotion && initialImageAvailable) {
    // Mostrar el estado solo si la preparación no termina de inmediato.
    const loadingTimer = setTimeout(() => {
      envelopePromptText.textContent = "Abriendo tu invitación…";
      envelopeLoadingStatus.textContent = "Abriendo tu invitación…";
      imageContainer.classList.add("is-loading");
    }, 150);
    const frames = images.map((src) => {
      const frame = new Image();
      frame.src = src;
      return frame.decode().then(() => src).catch(() => null);
    });
    let timeout;
    const readyFrames = await Promise.race([
      Promise.all(frames),
      new Promise(resolve => { timeout = setTimeout(() => resolve([]), 5000); }),
    ]);
    clearTimeout(timeout);
    clearTimeout(loadingTimer);
    imageContainer.classList.remove("is-loading");
    hideWelcomeText();
    scrollPrompt.classList.add("is-hidden");
    for (const src of readyFrames) {
      if (!src) continue;
      mainImage.src = src;
      await new Promise(resolve => setTimeout(resolve, 180));
    }
  } else {
    hideWelcomeText();
    scrollPrompt.classList.add("is-hidden");
  }
  scrollPrompt.removeAttribute("aria-busy");
  envelopeLoadingStatus.textContent = "";

  finished = true;
  scrollTrack.classList.add("is-open");
  showFinalContainer();
  window.requestAnimationFrame(alignFinalContainer);
  if (touchInProgress) {
    clearTimeout(scrollSettleTimer);
  } else {
    releaseScrollSettle(500);
  }
}

window.addEventListener("scroll", () => {
  if (scrollSettleActive) {
    if (finished && !touchInProgress) releaseScrollSettle();
    return;
  }
  // Solo una interacción explícita puede iniciar la animación.
  // Un scroll restaurado por el navegador vuelve a la portada sin abrirla.
  if (!started && window.scrollY > 0) alignFinalContainer();
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
