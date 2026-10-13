document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("stackContainer");
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".stack-card"));
  const rotations = cards.map(() => (Math.random() * 12 - 6).toFixed(2));

  let isAnimating = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let dragAxis = null;
  let currentX = 0;
  let activePointerType = null; // Previene doble disparo (touch vs mouse)

  let galleryIsNear = false;

  function prepareCard(card) {
    const image = card.querySelector("img");
    if (image.dataset.src) {
      image.loading = "eager";
      if (image.dataset.srcset) {
        image.srcset = image.dataset.srcset;
        delete image.dataset.srcset;
      }
      image.src = image.dataset.src;
      delete image.dataset.src;
    }
  }

  // Conservar los JPEG originales como respaldo si una descarga WebP falla.
  cards.forEach(card => {
    const image = card.querySelector("img");
    function useFallback() {
      if (!image.dataset.fallback) return;
      const fallback = image.dataset.fallback;
      delete image.dataset.fallback;
      delete image.dataset.srcset;
      image.removeAttribute("srcset");
      image.src = fallback;
    }
    image.addEventListener("error", useFallback);
    if (image.getAttribute("src") && image.complete && !image.naturalWidth) useFallback();
  });

  const galleryObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    galleryIsNear = true;
    prepareCard(cards[0]);
    prepareCard(cards[1]);
    galleryObserver.disconnect();
  }, { rootMargin: "600px 0px" });
  galleryObserver.observe(container);

  function updateStack() {
    if (galleryIsNear) {
      prepareCard(cards[0]);
      prepareCard(cards[1]);
    }
    cards.forEach((card, index) => {
      const zIndex = cards.length - index;
      const scale = 1 - index * 0.04;
      const translateY = index * 4;
      const rot = rotations[index];

      card.style.zIndex = zIndex;
      card.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rot}deg)`;
    });
  }

  function getTopCard() {
    return cards[0];
  }

  // --- NAVEGACIÓN TÁCTIL MÓVIL (TOUCH) ---
  container.addEventListener("touchstart", (e) => {
    if (isAnimating || e.touches.length !== 1) return;
    const topCard = getTopCard();
    if (e.target !== topCard && !topCard.contains(e.target)) return;

    activePointerType = "touch";
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragAxis = null;
    currentX = 0;
    
    topCard.style.transition = "none";
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || activePointerType !== "touch") return;

    if (e.touches.length !== 1) {
      cancelDrag();
      return;
    }
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (!dragAxis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      dragAxis = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
    }
    if (dragAxis === "vertical") {
      cancelDrag();
      return;
    }

    // Solo el gesto horizontal controla las fotos.
    if (e.cancelable) e.preventDefault();

    const topCard = getTopCard();
    currentX = e.touches[0].clientX - startX;
    const rot = currentX * 0.06;

    topCard.style.transform = `translateX(${currentX}px) rotate(${rot}deg)`;
  }, { passive: false });

  window.addEventListener("touchend", () => {
    if (!isDragging || activePointerType !== "touch") return;
    handleDragEnd();
  });

  function cancelDrag() {
    if (!isDragging) return;
    currentX = 0;
    handleDragEnd();
  }
  window.addEventListener("touchcancel", cancelDrag);
  window.addEventListener("pointercancel", cancelDrag);

  // --- NAVEGACIÓN DE RATÓN (DESKTOP) ---
  function onPointerDown(e) {
    if (e.pointerType === "touch" || isAnimating) return;
    const topCard = getTopCard();
    if (e.target !== topCard && !topCard.contains(e.target)) return;

    activePointerType = "mouse";
    isDragging = true;
    startX = e.clientX;
    currentX = 0;
    topCard.style.transition = "none";

    if (topCard.setPointerCapture) {
      try { topCard.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function onPointerMove(e) {
    if (!isDragging || activePointerType !== "mouse") return;

    const topCard = getTopCard();
    currentX = e.clientX - startX;
    const rot = currentX * 0.06;

    topCard.style.transform = `translateX(${currentX}px) rotate(${rot}deg)`;
  }

  function onPointerUp(e) {
    if (!isDragging || activePointerType !== "mouse") return;
    handleDragEnd();
  }

  // --- FINALIZACIÓN DE ARRASTRE FLUIDO ---
  function handleDragEnd() {
    isDragging = false;
    const topCard = getTopCard();
    const threshold = 65; // Sensibilidad de descarte

    // Aplicar transición fluida acelerada por hardware
    topCard.style.transition = "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s linear";

    prepareCard(cards[1]);
    const nextImage = cards[1].querySelector("img");
    // Si el invitado desliza más rápido que la red, conservar la foto actual.
    if (Math.abs(currentX) > threshold && nextImage.complete && nextImage.naturalWidth > 0) {
      isAnimating = true;
      const direction = currentX > 0 ? "swiped-right" : "swiped-out";
      topCard.classList.add(direction);

      // Transición rápida de salida (220ms)
      setTimeout(() => {
        cards.push(cards.shift());

        topCard.style.transition = "none";
        topCard.classList.remove("swiped-out", "swiped-right");
        
        updateStack();

        // Limpieza de estado
        currentX = 0;
        isAnimating = false;
        activePointerType = null;
      }, 220);

    } else {
      // Regreso a la posición inicial si no superó el umbral
      updateStack();
      currentX = 0;
      activePointerType = null;
    }
  }

  // Prevenir comportamientos por defecto
  container.addEventListener("dragstart", (e) => e.preventDefault());

  // Registros de ratón
  container.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  // Inicialización
  updateStack();
});
