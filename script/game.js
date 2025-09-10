import { Intern } from "./intern.js";
import { Boss } from "./boss.js";

// ==================== UI BUTTONS ====================

// Affiche le bouton menu principal
function showMenuButton() {
  const btn = document.getElementById('menuBtn');
  if (btn) {
    btn.style.display = 'inline-block';
    btn.onclick = () => window.location.href = './index.html';
  }
}

// Masque le bouton menu principal
function hideMenuButton() {
  const btn = document.getElementById('menuBtn');
  if (btn) btn.style.display = 'none';
}

// Affiche le bouton rejouer à la fin du jeu
function showReplayButton() {
  const btn = document.getElementById('replayBtn');
  if (btn) {
    btn.style.display = 'inline-block';
    btn.onclick = null;
    // Relance la partie sans recharger la page
    btn.onclick = () => {
      stopGame();
      startGame();
    };
  }
}

// Masque le bouton rejouer
function hideReplayButton() {
  const btn = document.getElementById('replayBtn');
  if (btn) btn.style.display = 'none';
}

// ==================== CANVAS & CONTEXT ====================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
hideReplayButton();
hideMenuButton();

// Redimensionne le canvas en plein écran
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ==================== BACKGROUND ====================

// Charge le background du jeu
const background = new Image();
background.src = "assets/background/background.png";

// ==================== GAME STATE ====================

// Création des joueurs (positions initiales, seront réinitialisées dans startGame)
let intern = new Intern(200, 200, 5, 20, canvas);
let boss   = new Boss(600, 400, 5, 25, canvas);

let keys = {};           // Stocke l'état des touches clavier
let gameOver = false;    // True si le jeu est perdu
let gameWon = false;     // True si le jeu est gagné
let animationId;         // Id de la boucle d'animation

// ==================== ARGENT ====================

let money = 0;           // Argent accumulé par l'intern
let goal = 70000;        // Objectif pour gagner

let moneyGains = [];     // Animations "+1000" qui s'affichent

// Intern gagne un montant aléatoire toutes les secondes
let moneyInterval = setInterval(() => {
  if (!gameOver && !gameWon) {
    // Gain aléatoire entre 500 et 2000
    const gain = Math.floor(Math.random() * 1500) + 500;
    money += gain;

    // Ajoute une animation pour le gain
    moneyGains.push({
      text: `+${gain}`,
      x: 20,
      y: 60, // sous le compteur
      alpha: 1, // opacité
      life: 60 // frames (~1 sec à 60fps)
    });

    // Vérifie si l'intern a gagné
    if (money >= goal) {
      gameWon = true;
      cancelAnimationFrame(animationId);
      draw(); // Affiche l'écran de fin immédiatement
    }
  }
}, 1000);

// ==================== INPUTS ====================

// Gestion du clavier (appui et relâchement)
window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});
window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// ==================== COLLISIONS ====================

// Collision entre l'intern et le boss
function checkCollision() {
  let dx = intern.x - boss.x;
  let dy = intern.y - boss.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < intern.size + boss.size;
}

// Petite fonction utilitaire pour attendre un délai (async)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Affiche les boutons de fin après un délai
async function showEndButtons() {
  await wait(2000); // attend 2 secondes
  showReplayButton();
  showMenuButton();
}

// ==================== BUREAUX ====================

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

// Calcul des coordonnées pour centrer les bureaux
const totalWidth = totalCols * deskWidth + (totalCols - 1) * xSpacing;
const totalHeight = rows * deskHeight + (rows - 1) * ySpacing;
const startX = (canvas.width - totalWidth) / 2;
const startY = (canvas.height - totalHeight) / 2;

// Génère la grille de bureaux
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

// Fonction utilitaire de collision rectangle/cercle (pour les bureaux)
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

// Dessine tout le jeu (background, bureaux, joueurs, UI, etc.)
function draw() {
  // Dessine le fond
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Dessine les bureaux
  ctx.fillStyle = "#bfa100";
  for (const desk of desks) {
    ctx.fillRect(desk.x, desk.y, desk.width, desk.height);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 4;
    ctx.strokeRect(desk.x, desk.y, desk.width, desk.height);
  }

  // Dessine les joueurs
  intern.draw(ctx);
  boss.draw(ctx);

  // Affiche le compteur d'argent
  ctx.fillStyle = "black";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
  ctx.fillText("💰 Argent: " + money + " €", 20, 40);

  // Affiche les animations de gains d'argent
  for (let i = 0; i < moneyGains.length; i++) {
    let g = moneyGains[i];
    ctx.globalAlpha = g.alpha;
    ctx.fillStyle = "green";
    ctx.font = "bold 22px Arial";
    ctx.fillText(g.text, g.x, g.y);

    // Animation du gain
    g.y -= 0.7;
    g.alpha -= 0.02;
    g.life--;

    if (g.life <= 0) {
      moneyGains.splice(i, 1);
      i--;
    }
    ctx.globalAlpha = 1;
  }

  // Affiche l'écran de fin si victoire ou défaite
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

    // Texte principal
    ctx.strokeStyle = "#000";
    ctx.strokeText(mainText, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(mainText, canvas.width / 2, canvas.height / 2);

    // Texte secondaire
    ctx.font = "45px 'Micro 5', monospace";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 6;
    ctx.strokeText(subText, canvas.width / 2, canvas.height / 2 + 70);
    ctx.fillStyle = "#fff";
    ctx.fillText(subText, canvas.width / 2, canvas.height / 2 + 70);

    // Affiche les boutons après un délai
    showEndButtons();
  }
}

// ==================== GAME LOOP ====================

// Met à jour la logique du jeu (déplacements, collisions, etc.)
function update() {
  if (gameOver || gameWon) return;

  // Déplacement de l'intern (flèches)
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

  // Déplacement du boss (ZQSD ou WASD selon layout)
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

  // Vérifie la collision entre boss et intern
  if (checkCollision()) {
    gameOver = true;
    cancelAnimationFrame(animationId);
  }
}

// Boucle principale du jeu (update + draw)
function gameLoop() {
  update();
  draw();
  if (!gameOver && !gameWon) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// ==================== START/STOP GAME ====================

// Initialise une nouvelle partie
export function startGame() {
  // Place les joueurs au centre du canvas, côte à côte
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

// Arrête la partie en cours
export function stopGame() {
  cancelAnimationFrame(animationId);
  clearInterval(moneyInterval);
  hideReplayButton();
  hideMenuButton();
}
