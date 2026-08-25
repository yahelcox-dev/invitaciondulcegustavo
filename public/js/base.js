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