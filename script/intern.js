
import { clampToBounds } from "./walls.js";

export class Intern {
  constructor(x, y, speed, size, canvas) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
    this.canvas = canvas;
  }

  draw(ctx) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
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
        break;
      case "ArrowRight":
        newX = this.x + this.speed;
        break;
    }
    // Appliquer la contrainte des murs
    const pos = clampToBounds(newX, newY, this.size, this.canvas);
    this.x = pos.x;
    this.y = pos.y;
  }
}
