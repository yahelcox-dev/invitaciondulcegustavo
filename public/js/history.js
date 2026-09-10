document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const book = document.getElementById("book");

  let currentPage = 0;
  const totalPages = pages.length;

  // Variables para detectar gestos de Swipe
  let startX = 0;
  let endX = 0;

  function updatePages(direction) {
    pages.forEach((page, index) => {
      page.classList.remove("active", "turned");

      if (index === currentPage) {
        page.classList.add("active");
      } else if (index < currentPage) {
        page.classList.add("turned");
      }
    });

    // Control de estado de los botones
    btnPrev.disabled = currentPage === 0;
    btnNext.disabled = currentPage === totalPages - 1;
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      updatePages("next");
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      updatePages("prev");
    }
  }

  // Eventos de clic
  btnNext.addEventListener("click", nextPage);
  btnPrev.addEventListener("click", prevPage);

  // Soporte para gestos táctiles (Swipe)
  book.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  book.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50; // Distancia mínima en px para registrar swipe
    const diffX = startX - endX;

    if (diffX > swipeThreshold) {
      nextPage(); // Deslizar a la izquierda -> Siguiente página
    } else if (diffX < -swipeThreshold) {
      prevPage(); // Deslizar a la derecha -> Página anterior
    }
  }
});