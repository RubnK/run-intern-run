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

// Masquer le bouton au début de partie
function hideReplayButton() {
  const btn = document.getElementById('replayBtn');
  if (btn) btn.style.display = 'none';
}

import { Intern } from "./intern.js";
import { Boss } from "./boss.js";

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

// Intern gagne 1000€ toutes les secondes
let moneyInterval = setInterval(() => {
  if (!gameOver && !gameWon) {
    money += 1000;

    // Ajouter une animation "+1000"
    moneyGains.push({
      text: "+1000",
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

function draw() {
  // dessiner background
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // dessiner joueurs
  intern.draw(ctx);
  boss.draw(ctx);

  // afficher compteur argent
  ctx.fillStyle = "black";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
  ctx.fillText("💰 Argent: " + money + " €", 20, 40);

  // dessiner les "+1000" en animation
  for (let i = 0; i < moneyGains.length; i++) {
    let g = moneyGains[i];
    ctx.globalAlpha = g.alpha;
    ctx.fillStyle = "green";
    ctx.font = "bold 22px Arial";
    ctx.fillText(g.text, g.x, g.y);

    // mise à jour animation
    g.y -= 0.7;       // monte doucement
    g.alpha -= 0.02;  // devient transparent
    g.life--;

    if (g.life <= 0) {
      moneyGains.splice(i, 1);
      i--;
    }
    ctx.globalAlpha = 1; // reset opacité
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
    // Texte du haut : doré avec bordure noire
    ctx.strokeStyle = "#000";
    ctx.strokeText(mainText, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(mainText, canvas.width / 2, canvas.height / 2);
    // Texte du bas : blanc avec bordure noire
    ctx.font = "45px 'Micro 5', monospace";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 6;
    ctx.strokeText(subText, canvas.width / 2, canvas.height / 2 + 70);
    ctx.fillStyle = "#fff";
    ctx.fillText(subText, canvas.width / 2, canvas.height / 2 + 70);
  showReplayButton();
  showMenuButton();
  }
}

function update() {
  if (gameOver || gameWon) return;

  // Intern (flèches)
  for (let key in keys) {
    if (keys[key]) {
      switch (key) {
        case "ArrowUp":
          intern.move("ArrowUp");
          break;
        case "ArrowDown":
          intern.move("ArrowDown");
          break;
        case "ArrowLeft":
          intern.move("ArrowLeft");
          break;
        case "ArrowRight":
          intern.move("ArrowRight");
          break;
      }
    }
  }

  // Boss (ZQSD)
  for (let key in keys) {
    if (keys[key]) {
      switch (key.toLowerCase()) {
        case "z":
          boss.move("z");
          break;
        case "s":
          boss.move("s");
          break;
        case "q":
          boss.move("q");
          break;
        case "d":
          boss.move("d");
          break;
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

background.onload = () => {
  gameLoop();
};
