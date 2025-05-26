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
    this.intervals = 30;
  }

  updatePoints = () => {
    for (let i = 0; i <= this.intervals; i++) {
      const ratio = i / this.intervals;
      const x = this.x1 + (this.x2 - this.x1) * ratio;
      const y = this.y1 + (this.y2 - this.y1) * ratio;
      this.points.push({ x, y });
    }
  };

  isInSquare = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;

    if (mouseX >= this.x1 && mouseX <= this.x2 && mouseY >= this.y1 && mouseY <= this.y2) {
      return true;
    }

    return false;
  };

  isMouseOnLine = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;
    let begin = this.points[0];

    for (let i = 1; i < this.points.length; i++) {
      const next = this.points[i];
      if (mouseX >= begin.x && mouseX <= next.x && mouseY >= begin.y && mouseY <= next.y) {
        return true;
      }
      begin = next;
    }

    return false;
  };

  onHover = (mousePosition) => {
    const isNeedCalculate = this.isInSquare(mousePosition);

    if (!isNeedCalculate) {
      return false;
    }

    const isHover = this.isMouseOnLine(mousePosition);

    if (!isHover) {
      return false;
    }

    return true;
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

    let begin = this.points[0];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);

    for (let i = 1; i < this.points.length; i++) {
      const current = this.points[i];
      ctx.lineTo(current.x, begin.y);
      ctx.lineTo(current.x, current.y);
      ctx.lineTo(begin.x, current.y);
      ctx.lineTo(begin.x, begin.y);
      ctx.moveTo(current.x, current.y);
      begin = current;
    }

    ctx.fillStyle = "rgba(105, 105, 230, 0.5)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    if (this.drag) {
      this.openDragRange(ctx);
    }
  };
}
