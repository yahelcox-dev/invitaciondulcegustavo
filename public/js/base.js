document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: null, // Usa el viewport del navegador
    threshold: 0.15 // Se activa cuando el 15% del elemento es visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Deja de observarlo si solo quieres que se anime la primera vez
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  // Selecciona todos los elementos con la clase .reveal
  const elementos = document.querySelectorAll(".reveal");
  elementos.forEach(el => observer.observe(el));
});


function redirigirMapsIglesia(){
  window.open('https://maps.app.goo.gl/cAZJT5Ym1J2ShDCw7', '_blank');
}

function redirigirMapsRecepcion(){
  window.open('https://maps.app.goo.gl/cAZJT5Ym1J2ShDCw7', '_blank');
  
}


/*galeria*/ 

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("stackContainer");
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".stack-card"));
  const rotations = cards.map(() => (Math.random() * 12 - 6).toFixed(2));

  let isAnimating = false;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let activeCard = null;

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

  // Prevenir que el navegador tome el control del scroll vertical/horizontal
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.cancelable) {
      e.preventDefault();
    }
  }, { passive: false });

  function onPointerDown(e) {
    if (isAnimating) return;

    const topCard = getTopCard();
    if (e.target !== topCard && !topCard.contains(e.target)) return;

    isDragging = true;
    activeCard = topCard;
    startX = e.clientX;
    currentX = 0;

    activeCard.style.transition = "none";

    // Forzar la captura del puntero en el elemento
    if (activeCard.setPointerCapture) {
      try {
        activeCard.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  }

  function onPointerMove(e) {
    if (!isDragging || !activeCard) return;

    currentX = e.clientX - startX;
    const rot = currentX * 0.08;

    activeCard.style.transform = `translateX(${currentX}px) rotate(${rot}deg)`;
  }

  function onPointerUp(e) {
    if (!isDragging || !activeCard) return;
    isDragging = false;

    const threshold = 70;

    if (activeCard.releasePointerCapture) {
      try {
        activeCard.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    activeCard.style.transition = "transform 0.35s ease, opacity 0.35s ease";

    if (Math.abs(currentX) > threshold) {
      isAnimating = true;
      const direction = currentX > 0 ? "swiped-right" : "swiped-out";
      activeCard.classList.add(direction);

      setTimeout(() => {
        cards.push(cards.shift());

        activeCard.style.transition = "none";
        updateStack();

        activeCard.offsetHeight; // Reflow forzado

        activeCard.style.transition = "";
        activeCard.classList.remove("swiped-out", "swiped-right");
        
        currentX = 0;
        activeCard = null;

        setTimeout(() => {
          isAnimating = false;
        }, 100);

      }, 350);

    } else {
      updateStack();
      currentX = 0;
      activeCard = null;
    }
  }

  // Prevenir arrastre de imágenes por defecto
  container.addEventListener("dragstart", (e) => e.preventDefault());

  // Registrar Pointer Events universales
  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointercancel", onPointerUp);

  updateStack();
});