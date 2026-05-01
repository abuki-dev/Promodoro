const minuet = document.getElementById("minuets");
const second = document.getElementById("seconds");
const ms = document.getElementById("micorsecond");
const start = document.getElementById("start-section");
const display = document.getElementById("timer-display");

const ringEl = document.getElementById("ring-progress");
const mainCard = document.getElementById("main-card");
const modalOverlay = document.getElementById("modal-overlay");
const btnDismiss = document.getElementById("btn-dismiss");

// ── Modal helpers ──
function showModal() {
  mainCard.classList.add("blurred");
  modalOverlay.classList.add("visible");
}

function hideModal() {
  modalOverlay.classList.remove("visible");
  mainCard.classList.remove("blurred");
}

btnDismiss.addEventListener("click", () => {
  hideModal();
  stopsound();
  start.disabled = false;
});
const alarm = new Audio("./assets/alarm.mp3");
// SVG ring: r=108, circumference = 2π × 108
const CIRCUMFERENCE = 2 * Math.PI * 108;

// Initialise ring to empty (no progress)
ringEl.style.strokeDasharray = CIRCUMFERENCE;
ringEl.style.strokeDashoffset = CIRCUMFERENCE;

const pad = (n) => String(n).padStart(2, "0");

function setRing(fraction) {
  // fraction 1 = full ring, 0 = empty
  ringEl.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);
}

start.addEventListener("click", () => {
  const inputMinutes = parseInt(document.getElementById("totalminuet").value);

  if (isNaN(inputMinutes) || inputMinutes <= 0) {
    alert("Please enter a valid positive number");
    return;
  }

  display.classList.remove("done");
  display.classList.add("running");
  start.disabled = true;

  startTimer(inputMinutes);
});

function startTimer(minutes) {
  const totalDuration = minutes * 60 * 1000;
  let totalMs = totalDuration;

  const timer = setInterval(() => {
    totalMs -= 100;

    const displayMinutes = Math.floor(totalMs / 60000);
    const displaySeconds = Math.floor((totalMs % 60000) / 1000);
    const displayMs = Math.floor((totalMs % 1000) / 10);

    minuet.textContent = pad(displayMinutes);
    second.textContent = pad(displaySeconds);
    ms.textContent = pad(displayMs);

    // Drive the ring — shrinks as time passes
    setRing(Math.max(0, totalMs / totalDuration));

    if (totalMs <= 0) {
      clearInterval(timer);
      minuet.textContent = "00";
      second.textContent = "00";
      ms.textContent = "00";
      setRing(0);
      playsound();

      display.classList.remove("running");
      display.classList.add("done");
      showModal();
    }
  }, 100);
}
function playsound() {
  alarm.play();
  alarm.loop = true;
}
function stopsound() {
  alarm.pause();
  alarm.currentTime = 0;
}
