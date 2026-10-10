window.playWeddingMusic = function() {
const container = document.querySelector("#audioWidget");
container.classList.remove("d-none");
container.classList.add("animate__animated")
container.classList.add("animate__fadeInRight")
container.classList.add("d-flex")


  const audio = document.getElementById("weddingAudio");
  const icon = document.getElementById("audioIcon");
  const wave = document.getElementById("soundWave");

  if (audio && audio.paused) {
    audio.play().then(() => {
      icon.className = "bi bi-pause-fill";
      wave.classList.add("playing");
    }).catch(err => {
      console.log("Autoplay restringido por el navegador:", err);
    });
  }
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