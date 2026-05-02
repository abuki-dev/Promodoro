const minuet = document.getElementById("minuets");
const second = document.getElementById("seconds");
const ms = document.getElementById("micorsecond");
const start = document.getElementById("start-section");
const resetBtn = document.getElementById("restart");
const display = document.getElementById("timer-display");
const ringEl = document.getElementById("ring-progress");
const mainCard = document.getElementById("main-card");
const modalOverlay = document.getElementById("modal-overlay");
const btnDismiss = document.getElementById("btn-dismiss");
const stop = document.getElementById("stop-section");
const stopLabel = stop.querySelector(".btn-label");
const stopIcon = stop.querySelector(".btn-icon svg");

// ── SVG ring ──
const CIRCUMFERENCE = 2 * Math.PI * 108;
ringEl.style.strokeDasharray = CIRCUMFERENCE;
ringEl.style.strokeDashoffset = CIRCUMFERENCE;

const pad = (n) => String(n).padStart(2, "0");

function setRing(fraction) {
  ringEl.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);
}

// ── Modal ──
function showModal() {
  mainCard.classList.add("blurred");
  modalOverlay.classList.add("visible");
}
function hideModal() {
  modalOverlay.classList.remove("visible");
  mainCard.classList.remove("blurred");
}

// ── Audio ──
const alarm = new Audio("./assets/alarm.mp3");
function playsound() {
  alarm.play();
  alarm.loop = true;
}
function stopsound() {
  alarm.pause();
  alarm.currentTime = 0;
}

// Custom audio file
document.getElementById("audio").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  alarm.src = URL.createObjectURL(file);
});

// ── Timer state ──
let activeTimer = null;
let curminuet = "00";
let cutrruntsecond = "00";
let curruntmilisec = "00";
let totalms = 0;

// ── Icons (SVG path data) ──
const ICON_PAUSE = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";
const ICON_CONTINUE = "M8 5v14l11-7z";

function setStopToContinue() {
  stopLabel.textContent = "Continue";
  stop.classList.add("continue");
  stopIcon.setAttribute("d", ICON_CONTINUE);
}
function setStopToStop() {
  stopLabel.textContent = "Stop";
  stop.classList.remove("continue");
  stopIcon.setAttribute("d", ICON_PAUSE);
}

function resetUI() {
  display.classList.remove("running", "done");
  minuet.textContent = "00";
  second.textContent = "00";
  ms.textContent = "00";
  minuet.classList.remove("urgent");
  second.classList.remove("urgent");
  setRing(0);
  start.disabled = false;
  resetBtn.disabled = true;
  stop.disabled = true;
  setStopToStop();
}

// ── Reset button ──
resetBtn.addEventListener("click", () => {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
  resetUI();
});

// ── Dismiss modal ──
btnDismiss.addEventListener("click", () => {
  hideModal();
  stopsound();
  resetUI();
});

// ── Start button ──
start.addEventListener("click", () => {
  const inputMinutes = parseInt(document.getElementById("totalminuet").value);
  if (isNaN(inputMinutes) || inputMinutes <= 0) {
    alert("Please enter a valid positive number.");
    return;
  }
  display.classList.remove("done");
  display.classList.add("running");
  start.disabled = true;
  resetBtn.disabled = false;
  stop.disabled = false;
  setStopToStop();
  startTimer(inputMinutes, null);
});

// ── Core timer ──
function startTimer(minutes, resume) {
  const totalDuration = resume || minutes * 10 * 1000;
  let totalMs = totalDuration;

  activeTimer = setInterval(() => {
    totalMs -= 100;
    totalms = totalMs;

    const displayMinutes = Math.floor(totalMs / 60000);
    const displaySeconds = Math.floor((totalMs % 60000) / 1000);
    const displayMs = Math.floor((totalMs % 1000) / 10);

    curruntmilisec = pad(displayMs);
    curminuet = pad(displayMinutes);
    cutrruntsecond = pad(displaySeconds);

    minuet.textContent = curminuet;
    second.textContent = cutrruntsecond;
    ms.textContent = curruntmilisec;

    setRing(Math.max(0, totalMs / totalDuration));

    // Urgent — last 3 minutes
    if (displayMinutes < 3 || (displayMinutes === 3 && displaySeconds === 0)) {
      minuet.classList.add("urgent");
      second.classList.add("urgent");
    } else {
      minuet.classList.remove("urgent");
      second.classList.remove("urgent");
    }

    if (totalMs <= 0) {
      clearInterval(activeTimer);
      activeTimer = null;
      minuet.textContent = "00";
      second.textContent = "00";
      ms.textContent = "00";
      minuet.classList.remove("urgent");
      second.classList.remove("urgent");
      setRing(0);
      playsound();
      display.classList.remove("running");
      display.classList.add("done");
      resetBtn.disabled = true;
      showModal();
    }
  }, 100);
}

// ── Stop / Continue toggle ──
stop.addEventListener("click", () => {
  if (stop.textContent.trim() === "Stop") {
    clearInterval(activeTimer);
    activeTimer = null;
    display.classList.remove("running", "done");
    minuet.textContent = curminuet;
    second.textContent = cutrruntsecond;
    ms.textContent = curruntmilisec;
    setStopToContinue();
  } else {
    clearInterval(activeTimer);
    activeTimer = null;
    display.classList.add("running");
    startTimer(null, totalms);
    setStopToStop();
  }
});
