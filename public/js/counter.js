
/*
    * =====================================================
    * FECHA OBJETIVO
    * =====================================================
    *
    * Formato:
    *
    * YYYY-MM-DDTHH:MM:SS
    *
    * Ejemplo:
    *
    * 25 de diciembre de 2026
    * 8:00 PM
    */

const targetDate =
    new Date("2026-11-23T14:00:00").getTime();


/*
    * Elementos HTML
    */

const daysElement =
    document.getElementById("days");

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");

const finishedElement =
    document.getElementById("finished");


/*
    * Agregar cero a la izquierda
    *
    * 5  -> 05
    * 10 -> 10
    */

function formatNumber(number) {

    return String(number).padStart(2, "0");

}


/*
    * Actualizar contador
    */

function updateCountdown() {

    const now =
        new Date().getTime();


    const difference =
        targetDate - now;


    /*
        * Si llegó la fecha
        */

    if (difference <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        finishedElement.classList.remove("d-none");

        clearInterval(countdownInterval);

        return;
    }


    /*
        * Cálculos
        */

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (difference %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (difference %
                (1000 * 60)
            ) /
            1000
        );


    /*
        * Mostrar valores
        */

    daysElement.textContent =
        formatNumber(days);

    hoursElement.textContent =
        formatNumber(hours);

    minutesElement.textContent =
        formatNumber(minutes);

    secondsElement.textContent =
        formatNumber(seconds);

}


/*
    * Ejecutar inmediatamente
    * para evitar que aparezca 00
    * durante el primer segundo.
    */

updateCountdown();


/*
    * Actualizar cada segundo
    */

const countdownInterval =
    setInterval(
        updateCountdown,
        1000
    );