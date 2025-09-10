
import { clampToBounds } from "./walls.js";

export class Boss {
  constructor(x, y, speed, size, canvas) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
    this.canvas = canvas;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
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
        break;
      case "d":
      case "D":
        newX = this.x + this.speed;
        break;
    }
    // Appliquer la contrainte des murs
    const pos = clampToBounds(newX, newY, this.size, this.canvas);
    this.x = pos.x;
    this.y = pos.y;
  }
}
