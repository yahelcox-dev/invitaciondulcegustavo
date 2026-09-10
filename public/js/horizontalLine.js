document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("timeline-container");
  const track = document.getElementById("timeline-track");
  const lineProgress = document.getElementById("timeline-line");

  function updateHorizontalScroll() {
    const containerRect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calcular cuánto se ha desplazado el contenedor relativo al viewport
    const totalDist = containerRect.height - windowHeight;
    const currentScroll = -containerRect.top;

    // Obtener porcentaje del proceso (0 a 1)
    let progress = currentScroll / totalDist;
    progress = Math.min(Math.max(progress, 0), 1);

    // 1. Mover el track de forma horizontal
    const maxTrackMove = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.1);
    const translateX = -progress * maxTrackMove;
    track.style.transform = `translateX(${translateX}px)`;

    // 2. Dibujar la línea proporcionalmente
    const maxLineWidth = track.scrollWidth - (window.innerWidth * 0.2);
    lineProgress.style.width = `${progress * maxLineWidth}px`;
  }

  window.addEventListener("scroll", updateHorizontalScroll);
  window.addEventListener("resize", updateHorizontalScroll);
  updateHorizontalScroll();
});