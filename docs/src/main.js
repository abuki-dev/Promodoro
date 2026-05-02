const minuet = document.getElementById("minuets");
const second = document.getElementById("seconds");
const ms = document.getElementById("micorsecond");
const start = document.getElementById("start-section");
const ResetButn = document.getElementById("restart");
const display = document.getElementById("timer-display");

const ringEl = document.getElementById("ring-progress");
const mainCard = document.getElementById("main-card");
const modalOverlay = document.getElementById("modal-overlay");
const btnDismiss = document.getElementById("btn-dismiss");
const stop = document.getElementById("stop-section");

// ── Modal helpers ──
function showModal() {
  mainCard.classList.add("blurred");
  modalOverlay.classList.add("visible");
}

function hideModal() {
  modalOverlay.classList.remove("visible");
  mainCard.classList.remove("blurred");
}

// ── Active timer reference (so stop can clear it) ──
let activeTimer = null;

// ── Stop button ──
ResetButn.addEventListener("click", () => {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  display.classList.remove("running", "done");
  minuet.textContent = "00";
  second.textContent = "00";
  ms.textContent = "00";
  setRing(0);
  start.disabled = false;
  ResetButn.disabled = true;
  stop.disabled = true;
});

btnDismiss.addEventListener("click", () => {
  hideModal();
  stopsound();
  display.classList.remove("done");
  minuet.textContent = "00";
  second.textContent = "00";
  ms.textContent = "00";
  setRing(0);
  start.disabled = false;
  ResetButn.disabled = true;
  stop.disabled = true;
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
  ResetButn.disabled = false;
  stop.disabled = false;
  startTimer(inputMinutes, null);
});

let curminuet = 0;
let curruntmilisec = 0;
let cutrruntsecond = 0;
let totalms = 0;

function startTimer(minutes, accept) {
  const totalDuration = accept || minutes * 60 * 1000;
  let totalMs = totalDuration;
  activeTimer = setInterval(() => {
    totalMs -= 100;
    totalms = totalMs;
    const displayMinutes = Math.floor(totalMs / 60000);
    const displaySeconds = Math.floor((totalMs % 60000) / 1000);
    const displayMs = Math.floor((totalMs % 1000) / 10);
    curruntmilisec = ms.textContent = pad(displayMs);
    curminuet = minuet.textContent = pad(displayMinutes);
    cutrruntsecond = second.textContent = pad(displaySeconds);

    // Drive the ring — shrinks as time passes
    setRing(Math.max(0, totalMs / totalDuration));
    if (displayMinutes <= 3) {
      // Add the red class
      minuet.classList.add("text-red");
      second.classList.add("text-red");
    } else {
      // Remove the red class if time is greater than 3 minutes
      minuet.classList.remove("text-red");
      second.classList.remove("text-red");
    }
    if (totalMs <= 0) {
      clearInterval(activeTimer);
      activeTimer = null;
      minuet.textContent = "00";
      second.textContent = "00";
      ms.textContent = "00";
      setRing(0);
      playsound();

      display.classList.remove("running");
      display.classList.add("done");
      ResetButn.disabled = true;
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
stop.addEventListener("click", () => {
  if (stop.textContent === "Stop") {
    clearInterval(activeTimer);
    activeTimer = null;
    display.classList.remove("running", "done");
    minuet.textContent = curminuet;
    second.textContent = cutrruntsecond;
    ms.textContent = curruntmilisec;
    setRing(0);
    stop.textContent = "Continue";
  } else {
    clearInterval(activeTimer);
    activeTimer = null;
    startTimer(null, totalms);
    stop.textContent = "Stop";
  }
});
