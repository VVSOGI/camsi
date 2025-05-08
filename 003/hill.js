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
    let prevCx = current.x;
    let prevCy = current.y;

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

    if (lastPoint.x > this.stageWidth + this.gap * 4) {
      this.points.pop();
    }

    ctx.moveTo(current.x, current.y);
    const dots = [];

    for (let i = 1; i < this.points.length; i++) {
      current = this.points[i];
      current.x += this.speed;

      const cx = (prev.x + current.x) / 2;
      const cy = (prev.y + current.y) / 2;

      ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);

      dots.push({
        x1: prevCx,
        y1: prevCy,
        x2: prev.x,
        y2: prev.y,
        x3: cx,
        y3: cy,
      });

      prev = current;
      prevCx = cx;
      prevCy = cy;
    }

    ctx.lineTo(prev.x, prev.y);
    ctx.lineTo(this.stageWidth, this.stageHeight);
    ctx.lineTo(this.points[0].x, this.stageHeight);
    ctx.fill();
    ctx.closePath();

    return dots;
  };

  getY = () => {
    const min = this.stageHeight / (this.total - 4);
    const max = this.stageHeight - min;
    return min + Math.random() * max;
  };
}
