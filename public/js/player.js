document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio-element");
  const playPauseBtn = document.getElementById("btn-play-pause");
  const iconPlay = document.getElementById("icon-play");
  const iconPause = document.getElementById("icon-pause");
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.getElementById("progress-container");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  const rewindBtn = document.getElementById("btn-rewind");
  const forwardBtn = document.getElementById("btn-forward");

  // Formatear segundos a mm:ss
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Cargar duración total
  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  // Alternar Reproducción / Pausa
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      iconPlay.classList.add("d-none");
      iconPause.classList.remove("d-none");
    } else {
      audio.pause();
      iconPause.classList.add("d-none");
      iconPlay.classList.remove("d-none");
    }
  });

  // Actualizar barra de progreso y tiempo actual
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  // Hacer click en la barra para adelantar o retroceder
  progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
  });

  // Controles de retroceso y avance rápido
  rewindBtn.addEventListener("click", () => (audio.currentTime -= 10));
  forwardBtn.addEventListener("click", () => (audio.currentTime += 10));
});