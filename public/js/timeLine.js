const timeline =
    document.getElementById(
        "storyTimeline"
    );


const activeLine =
    document.getElementById(
        "storyActiveLine"
    );


const dots =
    document.querySelectorAll(
        ".story-dot"
    );


const slides =
    document.querySelectorAll(
        ".story-slide"
    );


const navigation =
    document.querySelector(
        ".story-navigation"
    );


const totalSteps =
    slides.length;



/* =====================================================
   ACTUALIZAR TIMELINE
===================================================== */

function updateTimeline() {

    /*
     * Posición de la sección.
     */

    const rect =
        timeline.getBoundingClientRect();


    /*
     * Cuánto scroll necesita recorrer
     * nuestra sección.
     *
     * 400vh - 100vh = 300vh
     */

    const scrollDistance =
        timeline.offsetHeight -
        window.innerHeight;


    /*
     * Cuánto hemos recorrido.
     */

    let currentScroll =
        -rect.top;


    /*
     * Limitar entre 0 y scrollDistance.
     */

    currentScroll =
        Math.max(
            0,
            Math.min(
                currentScroll,
                scrollDistance
            )
        );


    /*
     * Progreso 0 → 1
     */

    const progress =
        currentScroll /
        scrollDistance;


    /*
     * =================================================
     * PASO
     * =================================================
     */

    let step =
        Math.floor(
            progress *
            totalSteps
        );


    if (step >= totalSteps) {

        step =
            totalSteps - 1;

    }


    /*
     * =================================================
     * SLIDES
     * =================================================
     */

    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === step
            );

        }
    );


    /*
     * =================================================
     * CÍRCULOS
     * =================================================
     */

    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === step
            );


            dot.classList.toggle(
                "completed",
                index < step
            );

        }
    );


    /*
     * =================================================
     * LÍNEA
     * =================================================
     */

    const navigationHeight =
        navigation.offsetHeight;


    const availableHeight =
        navigationHeight - 40;


    /*
     * Progreso de la línea.
     *
     * 0% → círculo 1
     * 33% → círculo 2
     * 66% → círculo 3
     * 100% → círculo 4
     */

    const lineProgress =
        progress;


    activeLine.style.height =
        `${availableHeight *
        lineProgress}px`;

}



/* =====================================================
   SCROLL
===================================================== */

let ticking = false;


window.addEventListener(
    "scroll",
    () => {

        if (!ticking) {

            window.requestAnimationFrame(
                () => {

                    updateTimeline();

                    ticking = false;

                }
            );

            ticking = true;

        }

    },
    {
        passive: true
    }
);



/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    updateTimeline
);



/* =====================================================
   INICIALIZAR
===================================================== */

updateTimeline();