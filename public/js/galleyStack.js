document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("stackContainer");
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".stack-card"));
  const rotations = cards.map(() => (Math.random() * 12 - 6).toFixed(2));

  let isAnimating = false;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let activePointerType = null; // Previene doble disparo (touch vs mouse)

  function updateStack() {
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
    if (isAnimating) return;
    const topCard = getTopCard();
    if (e.target !== topCard && !topCard.contains(e.target)) return;

    activePointerType = "touch";
    isDragging = true;
    startX = e.touches[0].clientX;
    currentX = 0;
    
    topCard.style.transition = "none";
  }, { passive: false });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || activePointerType !== "touch") return;

    // Cancela el scroll de la página por completo
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

    if (Math.abs(currentX) > threshold) {
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