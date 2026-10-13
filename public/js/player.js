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

  // Preparar el audio una sola vez, al entrar en la segunda sección o al pulsar play.
  async function startMusic() {
    try {
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
      // Si el navegador bloquea el autoplay, mantener disponible el botón manual.
      syncPlaybackState();
    }
  }

  window.playWeddingMusic = function() {
    widget.classList.remove("d-none");
    widget.classList.add("animate__animated", "animate__fadeInRight", "d-flex");
    if (audio.paused) startMusic();
  };

  function toggleAudio(e) {
    e.stopPropagation();
    if (audio.paused) startMusic();
    else audio.pause();
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