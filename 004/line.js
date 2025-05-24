export class Line {
  constructor(x1, y1, x2, y2) {
    this.id = new Date().getTime();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.drag = false;
    this.gap = 10;
    this.dragCornerRectSize = 10;

    this.points = [];
    this.intervals = 20;
  }

  updatePoints = () => {
    for (let i = 0; i <= this.intervals; i++) {
      const ratio = i / this.intervals;
      const x = this.x1 + (this.x2 - this.x1) * ratio;
      const y = this.y1 + (this.y2 - this.y1) * ratio;
      this.points.push({ x, y });
    }
  };

  openDragRange = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      this.x1 + this.dragCornerRectSize / 2,
      this.y1 + this.dragCornerRectSize / 2,
      -this.dragCornerRectSize,
      -this.dragCornerRectSize,
      4
    );
    ctx.roundRect(
      this.x2 + this.dragCornerRectSize / 2,
      this.y2 + this.dragCornerRectSize / 2,
      -this.dragCornerRectSize,
      -this.dragCornerRectSize,
      4
    );
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "rgba(105, 105, 230, 0.5)";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  drawDot = (ctx, x, y) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };

  draw = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    for (const point of this.points) {
      this.drawDot(ctx, point.x, point.y);
    }

    let start = this.points[0];

    if (this.drag) {
      this.openDragRange(ctx);
    }
  };
}
