
import { Intern } from "./intern.js";
import { Boss } from "./boss.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

  // afficher messages de fin
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  if (gameWon) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.fillText("VICTOIRE 💸", canvas.width / 2, canvas.height / 2);
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
