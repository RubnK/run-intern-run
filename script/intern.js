import { clampToBounds } from "./walls.js";
import { desks, rectCircleCollides } from "./game.js";

export class Intern {
  constructor(x, y, speed, size, canvas) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
    this.canvas = canvas;
    // Charge l'image du sprite de l'intern
    this.sprite = new Image();
    this.sprite.src = "assets/sprites/intern.png";
    this.facing = "right"; // direction initiale
  }

  draw(ctx) {
    // Dessine l'image centrée sur la position de l'intern
    const scale = 2.5;
    const w = this.size * 2 * scale;
    const h = this.size * 2 * scale;

    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.facing === "left") {
      ctx.scale(-1, 1); // miroir horizontal
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
      ctx.fillStyle = "blue";
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
      case "ArrowUp":
        newY = this.y - this.speed;
        break;
      case "ArrowDown":
        newY = this.y + this.speed;
        break;
      case "ArrowLeft":
        newX = this.x - this.speed;
        this.facing = "left";
        break;
      case "ArrowRight":
        newX = this.x + this.speed;
        this.facing = "right";
        break;
    }

    // Vérifie collision avec bureaux
    for (const desk of desks) {
      if (rectCircleCollides(desk, newX, newY, this.size)) {
        return;
      }
    }

    // Appliquer la contrainte des murs
    const pos = clampToBounds(newX, newY, this.size, this.canvas);
    this.x = pos.x;
    this.y = pos.y;
  }
}
