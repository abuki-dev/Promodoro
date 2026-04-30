const minuet = document.getElementById("minuets");
const second = document.getElementById("seconds");
const ms = document.getElementById("micorsecond");
const start = document.getElementById("start-section");
const display = document.getElementById("timer-display");
const message = document.getElementById("message");
const ringEl = document.getElementById("ring-progress");

// SVG ring: r=108, circumference = 2π × 108
const CIRCUMFERENCE = 2 * Math.PI * 108;

// Initialise ring to empty (no progress)
ringEl.style.strokeDasharray = CIRCUMFERENCE;
ringEl.style.strokeDashoffset = CIRCUMFERENCE;

const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

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

  message.textContent = "";
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

      display.classList.remove("running");
      display.classList.add("done");
      message.textContent = "✓ Session complete. Great work!";
      start.disabled = false;
    }
  }, 100);
}
