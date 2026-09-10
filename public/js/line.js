
//FUNCIONAL
// document.addEventListener("DOMContentLoaded", () => {
//   const line = document.getElementById("timeline-line");
//   const container = document.querySelector(".timeline-container");
//   const items = document.querySelectorAll(".timeline-item");

//   let targetProgress = 0;
//   let currentProgress = 0;

//   // 1. CÁLCULO DEL PROGRESO OBJETIVO
//   function calculateTarget() {
//     const rect = container.getBoundingClientRect();
//     const windowHeight = window.innerHeight;

//     // La línea comenzará a trazarse cuando el contenedor pase la mitad de la pantalla
//     const startPoint = windowHeight * 0.7; 
//     const currentScroll = startPoint - rect.top;

//     let progress = (currentScroll / rect.height) * 100;
//     targetProgress = Math.min(Math.max(progress, 0), 100);
//   }

//   // 2. ANIMACIÓN FLUIDA (LERP) QUE DA EL EFECTO LENTO/ELÁSTICO
//   function animateLine() {
//     // 0.05 define la "lentitud": valores más bajos = movimiento más suave y lento
//     currentProgress += (targetProgress - currentProgress) * 0.05;
    
//     line.style.height = `${currentProgress}%`;
//     requestAnimationFrame(animateLine);
//   }

//   window.addEventListener("scroll", calculateTarget);
  
//   // Iniciar la animación
//   calculateTarget();
//   animateLine();

//   // 3. FADE IN DE LOS ELEMENTOS
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add("visible");
//       }
//     });
//   }, { threshold: 0.2 });

//   items.forEach((item) => observer.observe(item));
// });



document.addEventListener("DOMContentLoaded", () => {
  const line = document.getElementById("timeline-line");
  const container = document.querySelector(".timeline-container");
  const items = document.querySelectorAll(".timeline-item");

  let targetProgress = 0;
  let currentProgress = 0;

  // 1. CÁLCULO DEL PROGRESO DE LA LÍNEA Y VISIBILIDAD DE CONTENEDORES
  function updateTimeline() {
    const windowHeight = window.innerHeight;

    // --- A. Dibujo de la Línea ---
    const rect = container.getBoundingClientRect();
    const startPoint = windowHeight * 0.7; 
    const currentScroll = startPoint - rect.top;

    let progress = (currentScroll / rect.height) * 100;
    targetProgress = Math.min(Math.max(progress, 0), 100);

    // --- B. Entrada y Salida (Fade-In / Fade-Out) de Contenedores ---
    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      
      // Define los límites dentro de la pantalla para que sea visible
      // Aparece cuando entra al 85% inferior y desaparece si supera el 15% superior
      const isVisible = itemRect.top < windowHeight * 0.85 && itemRect.bottom > windowHeight * 0.15;

      if (isVisible) {
        item.classList.add("visible");
      } else {
        item.classList.remove("visible"); // Al hacer scroll inverso, vuelve a ocultarse
      }
    });
  }

  // 2. ANIMACIÓN FLUIDA (LERP) DE LA LÍNEA
  function animateLine() {
    currentProgress += (targetProgress - currentProgress) * 0.05;
    line.style.height = `${currentProgress}%`;
    requestAnimationFrame(animateLine);
  }

  // Eventos
  window.addEventListener("scroll", updateTimeline);
  
  // Ejecución inicial
  updateTimeline();
  animateLine();
});