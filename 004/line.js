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

    this.threshold = 10;
  }

  onHover = (mousePosition) => {
    const isNeedCalculate = this.isInSquare(mousePosition);

    if (!isNeedCalculate) {
      return false;
    }

    const distance = this.getDistanceFromLine(mousePosition);
    if (distance > this.threshold) {
      return false;
    }

    return true;
  };

  onClick = (mousePosition) => {
    const isNeedCalculate = this.isInSquare(mousePosition);

    if (!isNeedCalculate) {
      return false;
    }

    const distance = this.getDistanceFromLine(mousePosition);
    if (distance <= this.threshold) {
      this.drag = true;
    }
  };

  isInSquare = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;

    const left = Math.min(this.x1, this.x2);
    const right = Math.max(this.x1, this.x2);
    const top = Math.min(this.y1, this.y2);
    const bottom = Math.max(this.y1, this.y2);

    if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
      return true;
    }

    return false;
  };

  /**
   * 직선의 방정식을 이용해서 마우스의 x, y 값이 직선으로부터 얼마나 떨어져있는지 확인
   */
  getDistanceFromLine = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;

    const A = this.y2 - this.y1;
    const B = this.x1 - this.x2;
    const C = this.x2 * this.y1 - this.x1 * this.y2;

    return Math.abs(A * mouseX + B * mouseY + C) / Math.sqrt(A * A + B * B);
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

    if (this.drag) {
      this.openDragRange(ctx);
    }
  };
}
