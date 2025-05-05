export class Hill {
  constructor(color, speed, total) {
    this.color = color;
    this.speed = speed;
    this.total = total;
  }

  resize = (stageWidth, stageHeight) => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.points = [];
    this.gap = Math.ceil(this.stageWidth / (this.total - 2));

    for (let i = 0; i < this.total; i++) {
      this.points[i] = {
        x: i * this.gap,
        y: this.getY(),
      };
    }
  };

  draw = (ctx) => {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    let current = this.points[0];
    let prev = current;
    let prevCx = prev.x;
    let prevCy = prev.y;

    current.x += this.speed;
    if (current.x > -this.gap) {
      this.points = [
        {
          x: -this.gap * 2,
          y: this.getY(),
        },
        ...this.points,
      ];
    }

    const lastPoint = this.points[this.points.length - 1];

    if (lastPoint.x > this.stageWidth + this.gap * 2) {
      this.points.pop();
    }

    ctx.moveTo(current.x, current.y);

    for (let i = 1; i < this.points.length; i++) {
      current = this.points[i];
      current.x += this.speed;

      const cx = Math.ceil(prev.x + current.x) / 2;
      const cy = Math.ceil(prev.y + current.y) / 2;

      ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);

      prev = current;
      prevCx = cx;
      prevCy = cy;
    }

    ctx.lineTo(prev.x, prev.y);
    ctx.lineTo(this.stageWidth, this.stageHeight);
    ctx.lineTo(this.points[0].x, this.stageHeight);
    ctx.fill();
    ctx.closePath();
  };

  getY = () => {
    const min = this.stageHeight / 8;
    const max = this.stageHeight - min;
    return min + Math.random() * max;
  };
}
