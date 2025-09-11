import { Intern } from "./intern.js";
import { Boss, spawnCoffee, drawCoffee } from "./boss.js";

// ==================== UI BUTTONS ====================
function showMenuButton() {
  const btn = document.getElementById('menuBtn');
  if (btn) {
    btn.style.display = 'inline-block';
    btn.onclick = () => window.location.href = './index.html';
  }
}

function hideMenuButton() {
  const btn = document.getElementById('menuBtn');
  if (btn) btn.style.display = 'none';
}

function showReplayButton() {
  const btn = document.getElementById('replayBtn');
  if (btn) {
    btn.style.display = 'inline-block';
    btn.onclick = null;
    btn.onclick = () => {
      // Redémarre la partie sans couper la musique
      cancelAnimationFrame(animationId);
      clearInterval(moneyInterval);
      // Réinitialise l'état du jeu mais ne touche pas à la musique
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const offset = 50;
      intern = new Intern(centerX - offset, centerY, 5, 20, canvas);
      boss   = new Boss(centerX + offset, centerY, 5, 25, canvas);
      keys = {};
      gameOver = false;
      gameWon = false;
      money = 0;
      moneyGains = [];
      coffee = null;
      hideReplayButton();
      hideMenuButton();
      resizeCanvas();
      background.onload = () => { gameLoop(); };
      if (background.complete) { gameLoop(); }
      moneyInterval = setInterval(() => {
        if (!gameOver && !gameWon) {
          const gain = Math.floor(Math.random() * 1500) + 500;
          money += gain;
          moneyGains.push({ text: `+${gain}`, x: 20, y: 60, alpha: 1, life: 60 });
          coinSound.volume = getGameVolume();
          coinSound.currentTime = 0;
          coinSound.play();
          if (money >= goal) {
            gameWon = true;
            cancelAnimationFrame(animationId);
            draw();
          }
        }
      }, 1000);
      scheduleCoffee();
    };
  }
}

function hideReplayButton() {
  const btn = document.getElementById('replayBtn');
  if (btn) btn.style.display = 'none';
}

// ==================== CANVAS & CONTEXT ====================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
hideReplayButton();
hideMenuButton();

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ==================== BACKGROUND ====================
const background = new Image();
background.src = "assets/background/background.png";

// ==================== GAME STATE ====================
let intern = new Intern(200, 200, 5, 20, canvas);
let boss   = new Boss(600, 400, 5, 25, canvas);

let keys = {};
let gameOver = false;
let gameWon = false;
let animationId;

// ==================== ARGENT ====================
let money = 0;
let goal = 40000;
let moneyGains = [];
let moneyInterval;

// ==================== SON ====================
const coinSound = new Audio("assets/sound/cashsound.mp3");
function getGameVolume() {
  const v = localStorage.getItem('gameVolume');
  if (v !== null) return Math.max(0, Math.min(1, parseInt(v, 10) / 100));
  return 0.5;
}
const music = new Audio("assets/sound/background.mp3");
music.loop = true;
music.preload = 'auto';
coinSound.volume = getGameVolume();
music.volume = getGameVolume() * 0.5; // musique moins forte que les effets

// ==================== CAFÉ ====================
let coffee;

function scheduleCoffee() {
  const delay = Math.floor(Math.random() * (15000 - 4000 + 1)) + 4000;
  setTimeout(() => {
    if (!coffee || !coffee.active) {
      coffee = spawnCoffee(canvas);
    }
    scheduleCoffee(); // replanifie la prochaine apparition
  }, delay);
}

// ==================== INPUTS ====================
window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});
window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// ==================== COLLISIONS ====================
function checkCollision() {
  let dx = intern.x - boss.x;
  let dy = intern.y - boss.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < intern.size + boss.size;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function showEndButtons() {
  await wait(2000);
  showReplayButton();
  showMenuButton();
}

// ==================== BUREAUX ====================
export const desks = [];
const deskWidth = 180;
const deskHeight = 90;
const centerCols = 3;
const sideCols = 2;
const totalCols = centerCols + sideCols * 2; 
const rows = 4;
const xSpacing = 300;
const ySpacing = 80;

const totalWidth = totalCols * deskWidth + (totalCols - 1) * xSpacing;
const totalHeight = rows * deskHeight + (rows - 1) * ySpacing;
const startX = (canvas.width - totalWidth) / 2;
const startY = (canvas.height - totalHeight) / 2;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < totalCols; col++) {
    desks.push({
      x: startX + col * (deskWidth + xSpacing),
      y: startY + row * (deskHeight + ySpacing),
      width: deskWidth,
      height: deskHeight
    });
  }
}

export function rectCircleCollides(rect, cx, cy, radius) {
  const distX = Math.abs(cx - rect.x - rect.width / 2);
  const distY = Math.abs(cy - rect.y - rect.height / 2);
  if (distX > (rect.width / 2 + radius)) return false;
  if (distY > (rect.height / 2 + radius)) return false;
  if (distX <= (rect.width / 2)) return true;
  if (distY <= (rect.height / 2)) return true;
  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return (dx * dx + dy * dy <= radius * radius);
}

// ==================== RENDU ====================
function draw() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#bfa100";
  for (const desk of desks) {
    ctx.fillRect(desk.x, desk.y, desk.width, desk.height);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 4;
    ctx.strokeRect(desk.x, desk.y, desk.width, desk.height);
  }

  intern.draw(ctx);
  boss.draw(ctx);

  ctx.fillStyle = "black";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
  ctx.fillText("💰 Argent: " + money + " €", 20, 40);

  for (let i = 0; i < moneyGains.length; i++) {
    let g = moneyGains[i];
    ctx.globalAlpha = g.alpha;
    ctx.fillStyle = "green";
    ctx.font = "bold 22px Arial";
    ctx.fillText(g.text, g.x, g.y);
    g.y -= 0.7;
    g.alpha -= 0.02;
    g.life--;
    if (g.life <= 0) {
      moneyGains.splice(i, 1);
      i--;
    }
    ctx.globalAlpha = 1;
  }

  drawCoffee(ctx);

  if (gameOver || gameWon) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.font = "130px 'Micro 5', monospace";
    ctx.lineWidth = 8;

    let mainText = "";
    let subText = "";
    if (gameWon) {
      mainText = "VICTOIRE DE L'INTERN";
      subText = "L'entreprise a fait faillite !";
    } else if (gameOver) {
      mainText = "VICTOIRE DU PATRON";
      subText = "L'intern a été attrapé par le patron !";
    }

    ctx.strokeStyle = "#000";
    ctx.strokeText(mainText, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(mainText, canvas.width / 2, canvas.height / 2);

    ctx.font = "45px 'Micro 5', monospace";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 6;
    ctx.strokeText(subText, canvas.width / 2, canvas.height / 2 + 70);
    ctx.fillStyle = "#fff";
    ctx.fillText(subText, canvas.width / 2, canvas.height / 2 + 70);

    showEndButtons();
  }
}

// ==================== GAME LOOP ====================
function update() {
  if (gameOver || gameWon) return;

  for (let key in keys) {
    if (keys[key]) {
      switch (key) {
        case "ArrowUp": intern.move("ArrowUp"); break;
        case "ArrowDown": intern.move("ArrowDown"); break;
        case "ArrowLeft": intern.move("ArrowLeft"); break;
        case "ArrowRight": intern.move("ArrowRight"); break;
      }
    }
  }

  const layout = localStorage.getItem('keyboardLayout') || 'azerty';
  for (let key in keys) {
    if (keys[key]) {
      if (layout === 'azerty') {
        switch (key.toLowerCase()) {
          case "z": boss.move("z"); break;
          case "s": boss.move("s"); break;
          case "q": boss.move("q"); break;
          case "d": boss.move("d"); break;
        }
      } else {
        switch (key.toLowerCase()) {
          case "w": boss.move("z"); break;
          case "s": boss.move("s"); break;
          case "a": boss.move("q"); break;
          case "d": boss.move("d"); break;
        }
      }
    }
  }

  if (checkCollision()) {
    gameOver = true;
    cancelAnimationFrame(animationId);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver && !gameWon) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// ==================== START/STOP GAME ====================
export function startGame() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const offset = 50;

  intern = new Intern(centerX - offset, centerY, 5, 20, canvas);
  boss   = new Boss(centerX + offset, centerY, 5, 25, canvas);

  keys = {};
  gameOver = false;
  gameWon = false;
  money = 0;
  moneyGains = [];
  coffee = null;

  hideReplayButton();
  hideMenuButton();
  resizeCanvas();

  background.onload = () => { gameLoop(); };
  if (background.complete) { gameLoop(); }

  // Musique de fond
  music.volume = getGameVolume() * 0.5;
  try { music.currentTime = 0; music.play(); } catch(e) {}
  
  moneyInterval = setInterval(() => {
    if (!gameOver && !gameWon) {
      const gain = Math.floor(Math.random() * 1500) + 500;
      money += gain;

      // animation
      moneyGains.push({ text: `+${gain}`, x: 20, y: 60, alpha: 1, life: 60 });

      // son
  coinSound.volume = getGameVolume();
  coinSound.currentTime = 0;
  coinSound.play();

      if (money >= goal) {
        gameWon = true;
        cancelAnimationFrame(animationId);
        draw();
      }
    }
  }, 1000);

  scheduleCoffee();
}

export function stopGame() {
  cancelAnimationFrame(animationId);
  clearInterval(moneyInterval);
  hideReplayButton();
  hideMenuButton();
  try { music.pause(); music.currentTime = 0; } catch(e) {}
}
