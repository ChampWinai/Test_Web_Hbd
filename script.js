const flame = document.getElementById("flame");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const wishes = [
  "ขอให้มีความสุขมาก ๆ สุขภาพแข็งแรง ร่ำรวยเงินทอง!",
  "ขอให้สมหวังในทุกสิ่งที่ตั้งใจไว้ พบเจอแต่สิ่งดี ๆ ในชีวิต!",
  "ขอให้ประสบความสำเร็จในหน้าที่การงานและความรัก!",
  "ขอให้มีรอยยิ้มและเสียงหัวเราะในทุก ๆ วัน!",
  "ขอให้โชคดี มีแต่คนรักและเอ็นดู!",
  "ขอให้สุขภาพแข็งแรงทั้งกายและใจ!",
  "ขอให้มีพลังบวกและแรงบันดาลใจใหม่ ๆ เสมอ!",
  "ขอให้ปีนี้เป็นปีที่ดีที่สุดของคุณ!",
  "ขอให้ได้พบเจอแต่เรื่องราวดี ๆ และคนดี ๆ!",
  "ขอให้ทุกวันเต็มไปด้วยความสุขและความสำเร็จ!",
];

function showRandomWish() {
  const wish = wishes[Math.floor(Math.random() * wishes.length)];
  statusText.innerHTML = `<strong>🎉 ${wish} 🎉</strong>`;
}

function showBalloons() {
  const colors = [
    "#ff69b4",
    "#87ceeb",
    "#fff700",
    "#ffb347",
    "#b2f7ef",
    "#fcb6f6",
  ];
  const balloons = document.getElementById("balloons");
  balloons.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const b = document.createElement("div");
    b.className = "balloon";
    b.style.left = 10 + Math.random() * 80 + "vw";
    b.style.background = colors[Math.floor(Math.random() * colors.length)];
    b.style.animationDelay = Math.random() * 0.7 + "s";
    balloons.appendChild(b);
  }
  setTimeout(() => {
    balloons.innerHTML = "";
  }, 3000);
}

async function initAudioDetection() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  const dataArray = new Uint8Array(analyser.fftSize);

  source.connect(analyser);

  function detectSound() {
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i] - 128;
      sum += value * value;
    }
    const volume = Math.sqrt(sum / dataArray.length);

    if (volume > 20) {
      // ค่าความดังเสียงเป่า
      flame.style.display = "none";
      document.getElementById("smoke").classList.add("active");
      showRandomWish();
      showBalloons(); // เรียก showBalloons() หลังเป่าเทียนดับ
    }

    requestAnimationFrame(detectSound);
  }

  detectSound();
}

resetBtn.addEventListener("click", () => {
  flame.style.display = "block";
  statusText.textContent = "ลองเป่าดูสิ!";
  document.getElementById("smoke").classList.remove("active");
  document.getElementById("balloons").innerHTML = "";
  cakeNameInput.value = "";
  cakeNameDisplay.textContent = "";
});

document.getElementById("startBtn").addEventListener("click", () => {
  initAudioDetection().catch((err) => {
    alert("ไม่สามารถเข้าถึงไมโครโฟนได้");
  });
  document.getElementById("startBtn").style.display = "none";
});

function getNextAprilFirst() {
  const now = new Date();
  let year = now.getFullYear();
  const aprilFirst = new Date(year, 3, 1, 0, 0, 0); // เดือน 3 = เมษายน (0-based)
  if (now > aprilFirst) {
    year += 1;
  }
  return new Date(year, 3, 1, 0, 0, 0);
}

function updateCountdown() {
  const countdownElem = document.getElementById("countdown");
  const now = new Date();
  const target = getNextAprilFirst();
  let diff = Math.max(0, target - now);

  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
  diff %= 1000 * 60 * 60;
  const minutes = String(Math.floor(diff / (1000 * 60))).padStart(2, "0");
  diff %= 1000 * 60;
  const seconds = String(Math.floor(diff / 1000)).padStart(2, "0");

  countdownElem.textContent = `นับถอยหลังสู่ 1 เมษายน: ${hours}:${minutes}:${seconds}`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

const cakeElem = document.querySelector(".cake");
const cakeTheme = document.getElementById("cakeTheme");
cakeTheme.addEventListener("change", (e) => {
  cakeElem.className = "cake " + e.target.value;
});

const cakeNameInput = document.getElementById("cakeName");
const cakeNameDisplay = document.getElementById("cakeNameDisplay");
cakeNameInput.addEventListener("input", () => {
  cakeNameDisplay.textContent = cakeNameInput.value
    ? `สุขสันต์วันเกิด ${cakeNameInput.value}`
    : "";
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

document.getElementById("toggleNight").addEventListener("click", () => {
  document.body.classList.toggle("night");
});
