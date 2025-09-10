class Intern {
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
    const min = this.size;
    const maxLeft = this.canvas.width - this.size;
    const maxTop = this.canvas.height - this.size;

    switch (key) {
      case "ArrowUp":
        this.y = this.y - this.speed >= min ? this.y - this.speed : min;
        break;
      case "ArrowDown":
        this.y = this.y + this.speed <= maxTop ? this.y + this.speed : maxTop;
        break;
      case "ArrowLeft":
        this.x = this.x - this.speed >= min ? this.x - this.speed : min;
        break;
      case "ArrowRight":
        this.x = this.x + this.speed <= maxLeft ? this.x + this.speed : maxLeft;
        break;
    }
  }
}
