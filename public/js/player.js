// Se conserva el nombre usado por la apertura del sobre: solo muestra el control.
window.playWeddingMusic = function() {
  const container = document.querySelector("#audioWidget");
  container.classList.remove("d-none");
  container.classList.add("animate__animated", "animate__fadeInRight", "d-flex");
};

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("weddingAudio");
  const widget = document.getElementById("audioWidget");
  const toggleBtn = document.getElementById("audioToggleBtn");
  const collapseBtn = document.getElementById("collapseBtn");
  const wave = document.getElementById("soundWave");
  const icon = document.getElementById("audioIcon");
  const volumeSlider = document.getElementById("volumeSlider");

  if (!audio || !widget) return;

  audio.loop = true;
  audio.volume = volumeSlider.value;

  // Alternar Reproducción / Pausa
  async function toggleAudio(e) {
    e.stopPropagation();
    if (audio.paused) {
      try {
        // No se asigna ninguna URL de audio hasta la primera pulsación.
        const pendingSources = audio.querySelectorAll("source[data-src]");
        if (pendingSources.length) {
          pendingSources.forEach(source => {
            source.src = source.dataset.src;
            delete source.dataset.src;
          });
          audio.load();
        }
        await audio.play();
      } catch (err) {
        syncPlaybackState();
      }
    } else {
      audio.pause();
      icon.className = "bi bi-play-fill";
      wave.classList.remove("playing");
    }
  }

  function syncPlaybackState() {
    const playing = !audio.paused && !audio.error;
    icon.className = playing ? "bi bi-pause-fill" : "bi bi-play-fill";
    wave.classList.toggle("playing", playing);
    toggleBtn.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
  }
  audio.addEventListener("play", syncPlaybackState);
  audio.addEventListener("pause", syncPlaybackState);
  audio.addEventListener("error", syncPlaybackState);
  syncPlaybackState();

  // Expandir al hacer clic en las barras o el widget contraído
  widget.addEventListener("click", () => {
    if (widget.classList.contains("collapsed")) {
      widget.classList.remove("collapsed");
    }
  });

  // Contraer al hacer clic en la flecha
  collapseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    widget.classList.add("collapsed");
  });

  toggleBtn.addEventListener("click", toggleAudio);

  volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });
});