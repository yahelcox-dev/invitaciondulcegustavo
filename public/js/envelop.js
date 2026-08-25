const mainImage = document.getElementById("mainImage");
const imageContainer = document.getElementById("imageContainer");
const finalContainer = document.getElementById("finalContainer");
const mainTextContainer = document.getElementById("main-text-container");
const welcomeText = document.querySelectorAll(".welcome-text");
const scene = document.querySelector("#scene");
const images = [
  "/public/images/env_1.jpg",
  "/public/images/env_2.jpg",
  "/public/images/env_252.jpg",
  "/public/images/env_293.png",
  "/public/images/env3.png",
];

let started = false;

mainImage.addEventListener("click", () => {
  if (started) return;

    welcomeText.forEach((element,index) => {
        element.classList.add("animate__animated");
        element.classList.add("animate__fadeOut");

        setTimeout(()=>{
            element.classList.add("d-none");
        },800 + (50*index))
        
    });

  started = true;

  // Ocultar imagen inicial
  mainImage.classList.add("fade-out");

  setTimeout(() => {
    showImage(0);
  }, 800);
});

function showImage(index) {
  mainImage.src = images[index];


  // Reiniciar animación
  mainImage.classList.remove("fade-out");
  mainImage.classList.remove("fade-in");

  // Fuerza al navegador a recalcular la animación
  void mainImage.offsetWidth;

  mainImage.classList.add("fade-in");

  // Esperar antes de mostrar la siguiente
  setTimeout(() => {
    if (index < images.length - 1) {
      setTimeout(() => {
        showImage(index + 1);
      }, 5);
    }
    else {

      // Terminamos todas las imágenes
      showFinalContainer();

    }

  }, 85);
}



function showFinalContainer() {
    scene.classList.remove("scene-border")
     //scene.classList.add("other-border")

    finalContainer.classList.add("show");
    finalContainer.classList.remove("d-none")
    finalContainer.classList.add("animate__animated");
    finalContainer.classList.add("animate__zoomIn");
    imageContainer.classList.add("animate__animated");
    finalContainer.classList.add("animate__fateOut");
    imageContainer.classList.add("visually-hidden")
    showMainTextTop()

    const audio = document.getElementById("audio-element");
    audio.play();
}

function showMainTextTop(){
    setTimeout(() => {
        mainTextContainer.classList.remove("d-none")
        mainTextContainer.classList.add("animate__animated")
        mainTextContainer.classList.add("animate__fadeIn")
    }, 700);
}