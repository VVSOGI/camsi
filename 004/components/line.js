export class Line {
  constructor(x1, y1, x2, y2) {
    this.id = new Date().getTime();
    this.originX1 = x1;
    this.originY1 = y1;
    this.originX2 = x2;
    this.originY2 = y2;

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.drag = false;
    this.endpointHover = false;
    this.gap = 10;
    this.dragCornerRectSize = 10;

    this.threshold = 10;
  }

  initializeOriginPosition = () => {
    this.originX1 = this.x1;
    this.originX2 = this.x2;
    this.originY1 = this.y1;
    this.originY2 = this.y2;
  };

  onHover = (mousePosition, canvas) => {
    const distance = this.getDistanceFromLine(mousePosition);

    if (distance <= this.threshold) {
      canvas.style.cursor = "move";
    }

    if (this.drag) {
      const { mouseX, mouseY } = mousePosition;
      const centerX = this.x1;
      const centerY = this.y1;

      if (
        mouseX >= centerX - this.dragCornerRectSize / 2 &&
        mouseX < centerX + this.dragCornerRectSize / 2 &&
        mouseY >= centerY - this.dragCornerRectSize / 2 &&
        mouseY < centerY + this.dragCornerRectSize / 2
      ) {
        canvas.style.cursor = "pointer";
      }
    }
  };

  onMove = (movePosition) => {
    if (!this.drag) return;

    const { x, y } = movePosition;

    this.x1 = this.originX1 + x;
    this.y1 = this.originY1 + y;
    this.x2 = this.originX2 + x;
    this.y2 = this.originY2 + y;
  };

  isClicked = (mousePosition) => {
    const isNeedCalculate = this.isInSquare(mousePosition);

    if (!isNeedCalculate) {
      return false;
    }

    const distance = this.getDistanceFromLine(mousePosition);
    if (distance <= this.threshold) {
      this.drag = true;
      return true;
    }

    return false;
  };

  isInSquare = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;

    let left = Math.min(this.x1, this.x2);
    let right = Math.max(this.x1, this.x2);
    let top = Math.min(this.y1, this.y2);
    let bottom = Math.max(this.y1, this.y2);

    if (Math.abs(left - right) < 10) {
      left -= this.threshold;
      right += this.threshold;
    }

    if (Math.abs(top - bottom) < 10) {
      top -= this.threshold;
      bottom += this.threshold;
    }

    if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
      return true;
    }

    return false;
  };

  /**
   * 직선의 방정식을 이용해서 마우스의 x, y 값이 직선으로부터 얼마나 떨어져있는지 확인
   */
  getDistanceFromLine = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;

    if (mouseX < this.x1 || mouseX > this.x2 || mouseY < this.y1 || mouseY > this.y2) {
      return this.threshold + 1;
    }

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
