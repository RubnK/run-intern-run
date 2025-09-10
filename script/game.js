import { Intern } from "./intern.js";
import { Boss } from "./boss.js";
// Affichage/Masquage du bouton menu principal
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
// Affichage du bouton rejouer à la fin (HTML)
function showReplayButton() {
  const btn = document.getElementById('replayBtn');
  if (btn) {
    btn.style.display = 'inline-block';
    // Supprime tout ancien écouteur
    btn.onclick = null;
    btn.onclick = () => window.location.reload();
  }
}
function hideReplayButton() {
  const btn = document.getElementById('replayBtn');
  if (btn) btn.style.display = 'none';
}


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
hideReplayButton();
hideMenuButton();

// resize canvas plein écran
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// charger le background
const background = new Image();
background.src = "assets/background/background.png";

// création des joueurs
let intern = new Intern(200, 200, 5, 20, canvas);
let boss   = new Boss(600, 400, 5, 25, canvas);

let keys = {};
let gameOver = false;
let gameWon = false;
let animationId;

// 💰 compteur argent
let money = 0;
let goal = 70000;

// Liste des animations "+1000"
let moneyGains = [];

// Intern gagne un montant aléatoire toutes les secondes
let moneyInterval = setInterval(() => {
  if (!gameOver && !gameWon) {
    // Gain aléatoire entre 500 et 2000
    const gain = Math.floor(Math.random() * 1500) + 500;
    money += gain;

    // Ajouter une animation avec le bon montant
    moneyGains.push({
      text: `+${gain}`,
      x: 20,
      y: 60, // sous le compteur
      alpha: 1, // opacité
      life: 60 // frames (~1 sec à 60fps)
    });

    if (money >= goal) {
      gameWon = true;
      cancelAnimationFrame(animationId);
      draw(); // Affiche l'écran de fin immédiatement
    }
  }
}, 1000);

// gestion clavier
window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});
window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

function checkCollision() {
  let dx = intern.x - boss.x;
  let dy = intern.y - boss.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < intern.size + boss.size;
}

// Petite fonction utilitaire pour attendre un délai
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Affiche les boutons après un délai (async/await)
async function showEndButtons() {
  await wait(2000); // attend 2 secondes
  showReplayButton();
  showMenuButton();
}

// Définition des bureaux (obstacles) : 4 lignes de 7 bureaux chacun (3 centraux + 2 à gauche + 2 à droite)
export const desks = [];
const deskWidth = 180;    // largeur bureau (plus grand)
const deskHeight = 90;    // hauteur bureau (plus grand)
const centerCols = 3;
const sideCols = 2;
const totalCols = centerCols + sideCols * 2; // 7 colonnes au total
const rows = 4;
const xSpacing = 300;     // espace horizontal entre bureaux (encore plus grand)
const ySpacing = 80;      // espace vertical entre bureaux (plus grand)

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

// Fonction utilitaire de collision rectangle/cercle
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

function draw() {
  // dessiner background
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // dessiner bureaux
  ctx.fillStyle = "#bfa100";
  for (const desk of desks) {
    ctx.fillRect(desk.x, desk.y, desk.width, desk.height);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 4;
    ctx.strokeRect(desk.x, desk.y, desk.width, desk.height);
  }

  // dessiner joueurs
  intern.draw(ctx);
  boss.draw(ctx);

  // afficher compteur argent
  ctx.fillStyle = "black";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
  ctx.fillText("💰 Argent: " + money + " €", 20, 40);

  // dessiner les gains en animation
  for (let i = 0; i < moneyGains.length; i++) {
    let g = moneyGains[i];
    ctx.globalAlpha = g.alpha;
    ctx.fillStyle = "green";
    ctx.font = "bold 22px Arial";
    ctx.fillText(g.text, g.x, g.y);

    // mise à jour animation
    g.y -= 0.7;
    g.alpha -= 0.02;
    g.life--;

    if (g.life <= 0) {
      moneyGains.splice(i, 1);
      i--;
    }
    ctx.globalAlpha = 1;
  }

  // écran de fin style 8bits
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

    // Texte du haut
    ctx.strokeStyle = "#000";
    ctx.strokeText(mainText, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(mainText, canvas.width / 2, canvas.height / 2);

    // Texte du bas
    ctx.font = "45px 'Micro 5', monospace";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 6;
    ctx.strokeText(subText, canvas.width / 2, canvas.height / 2 + 70);
    ctx.fillStyle = "#fff";
    ctx.fillText(subText, canvas.width / 2, canvas.height / 2 + 70);

    // Appel async pour afficher les boutons avec délai
    showEndButtons();
  }
}

function update() {
  if (gameOver || gameWon) return;

  // Intern (flèches)
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

  // Boss (ZQSD ou WASD selon layout)
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

  // check collision
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

// Pour contrôle depuis menu.ts
export function startGame() {
  // Calculer le centre du canvas
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const offset = 50; // distance entre les deux personnages

  intern = new Intern(centerX - offset, centerY, 5, 20, canvas);
  boss   = new Boss(centerX + offset, centerY, 5, 25, canvas);

  keys = {};
  gameOver = false;
  gameWon = false;
  money = 0;
  moneyGains = [];
  hideReplayButton();
  hideMenuButton();
  resizeCanvas();
  background.onload = () => {
    gameLoop();
  };
  if (background.complete) {
    gameLoop();
  }
}

export function stopGame() {
  cancelAnimationFrame(animationId);
  clearInterval(moneyInterval);
  hideReplayButton();
  hideMenuButton();
}
