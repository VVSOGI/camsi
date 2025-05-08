export class Sun {
  constructor() {
    this.degree = 5;
    this.totalDots = 72;
    this.radius = 150;
    this.x = 200;
    this.y = 180;

    this.totalFrame = 8;
    this.curFrame = 0;
    this.fps = 24;
    this.fpsTime = 1000 / this.fps;
  }

  resize = (stageWidth, stageHeight) => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  };

  animate = (t, ctx) => {
    ctx.beginPath();

    const startX = this.stageWidth - this.x + this.radius + 2 * Math.random();
    const startY = this.y + 2 * Math.random();
    let prevX = startX;
    let prevY = startY;
    ctx.moveTo(prevX, prevY);

    for (let i = 1; i < 72; i++) {
      const angle = i * this.degree * (Math.PI / 180);
      const x = this.stageWidth - this.x + this.radius * Math.cos(angle) + 2 * Math.random();
      const y = this.y + this.radius * Math.sin(angle) + 2 * Math.random();

      ctx.lineTo(x, y);

      prevX = x;
      prevY = y;
    }

    ctx.lineTo(startX, startY);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  };
}
