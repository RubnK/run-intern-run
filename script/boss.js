class Boss {
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
    const min = this.size;
    const maxLeft = this.canvas.width - this.size;
    const maxTop = this.canvas.height - this.size;

    switch (key) {
      case "z":
      case "Z":
        this.y = this.y - this.speed >= min ? this.y - this.speed : min;
        break;
      case "s":
      case "S":
        this.y = this.y + this.speed <= maxTop ? this.y + this.speed : maxTop;
        break;
      case "q":
      case "Q":
        this.x = this.x - this.speed >= min ? this.x - this.speed : min;
        break;
      case "d":
      case "D":
        this.x = this.x + this.speed <= maxLeft ? this.x + this.speed : maxLeft;
        break;
    }
  }
}
