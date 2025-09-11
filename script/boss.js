import { clampToBounds, getWallBounds } from "./walls.js";
import { desks, rectCircleCollides } from "./game.js";

// Café : position et état
let coffee = null;
let coffeeTimeout = null;

export function spawnCoffee(canvas) {
  // Récupère les limites jouables du plateau (hors murs)
  const bounds = getWallBounds(canvas);
  let valid = false;
  let x, y;
  while (!valid) {
    x = Math.random() * (canvas.width - bounds.right - bounds.left - 60) + bounds.left + 30;
    y = Math.random() * (canvas.height - bounds.bottom - bounds.top - 60) + bounds.top + 30;
    valid = true;
    for (const desk of desks) {
      if (rectCircleCollides(desk, x, y, 20)) {
        valid = false;
        break;
      }
    }
  }
  coffee = { x, y, radius: 20, active: true };
}

export function drawCoffee(ctx) {
  if (coffee && coffee.active) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(coffee.x, coffee.y, coffee.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#8B4513"; 
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.arc(coffee.x, coffee.y - 15, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#eee";
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  }
}

export class Boss {
  constructor(x, y, speed, size, canvas) {
    this.x = x;
    this.y = y;
    this.baseSpeed = speed / 2; // vitesse normale réduite
    this.speed = this.baseSpeed;
    this.size = size;
    this.canvas = canvas;
    this.sprite = new Image();
    this.sprite.src = "assets/sprites/boss.png";
    this.facing = "right";
    this.coffeeBoost = false;
  }

  draw(ctx) {
    const scale = 2.5;
    const w = this.size * 2 * scale;
    const h = this.size * 2 * scale;

    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.facing === "left") {
      ctx.scale(-1, 1);
    }
    if (this.sprite.complete) {
      ctx.drawImage(
        this.sprite,
        -w / 2,
        -h / 2,
        w,
        h
      );
    } else {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  move(key) {
    let newX = this.x;
    let newY = this.y;

    switch (key) {
      case "z":
      case "Z":
        newY = this.y - this.speed;
        break;
      case "s":
      case "S":
        newY = this.y + this.speed;
        break;
      case "q":
      case "Q":
        newX = this.x - this.speed;
        this.facing = "left";
        break;
      case "d":
      case "D":
        newX = this.x + this.speed;
        this.facing = "right";
        break;
    }

    // Collision avec bureaux
    for (const desk of desks) {
      if (rectCircleCollides(desk, newX, newY, this.size)) {
        return;
      }
    }

    // Collision avec café
    if (coffee && coffee.active) {
      let dx = newX - coffee.x;
      let dy = newY - coffee.y;
      if (Math.sqrt(dx * dx + dy * dy) < this.size + coffee.radius) {
        coffee.active = false;
        this.speed = this.baseSpeed * 3;
        this.coffeeBoost = true;
        // Timer pour remettre la vitesse à la normale après 3 secondes
        if (coffeeTimeout) clearTimeout(coffeeTimeout);
        coffeeTimeout = setTimeout(() => {
          this.speed = this.baseSpeed;
          this.coffeeBoost = false;
        }, 3000);
      }
    }

    // Appliquer la contrainte des murs
    const pos = clampToBounds(newX, newY, this.size, this.canvas);
    this.x = pos.x;
    this.y = pos.y;
  }
}
