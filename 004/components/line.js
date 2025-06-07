export class Line {
  constructor(x1, y1, x2, y2) {
    this.id = new Date().getTime();
    this.originPoint1 = { x: x1, y: y1 };
    this.originPoint2 = { x: x2, y: y2 };
    this.point1 = { x: x1, y: y1 };
    this.point2 = { x: x2, y: y2 };

    this.drag = false;
    this.hoverEndpoint = null;
    this.moveCornorPoint = -1;

    this.gap = 10;
    this.dragCornerRectSize = 10;
    this.threshold = 10;
  }

  initializeOriginPosition = () => {
    this.originPoint1 = {
      x: this.point1.x,
      y: this.point1.y,
    };

    this.originPoint2 = {
      x: this.point2.x,
      y: this.point2.y,
    };

    this.moveCornorPoint = -1;
  };

  onHover = (mousePosition, canvas) => {
    const distance = this.getDistanceFromLine(mousePosition);

    if (distance <= this.threshold) {
      canvas.style.cursor = "move";
    }

    if (this.drag) {
      const { onCornorPoint, point } = this.isMouseOnCornorPoint(mousePosition);
      if (onCornorPoint) {
        this.hoverEndpoint = point;
        canvas.style.cursor = "pointer";
      } else {
        this.hoverEndpoint = null;
      }
    }
  };

  onMove = (movePosition) => {
    if (!this.drag) return;
    const { x, y } = movePosition;

    if (this.moveCornorPoint > -1) {
      const originTarget = this.moveCornorPoint === 1 ? this.originPoint1 : this.originPoint2;
      const target = this.moveCornorPoint === 1 ? this.point1 : this.point2;
      target.x = originTarget.x + x;
      target.y = originTarget.y + y;

      this.hoverEndpoint = { x: target.x, y: target.y };
      return;
    }

    this.point1 = {
      x: this.originPoint1.x + x,
      y: this.originPoint1.y + y,
    };

    this.point2 = {
      x: this.originPoint2.x + x,
      y: this.originPoint2.y + y,
    };
  };

  onMouseUp = () => {
    this.initializeOriginPosition();
  };

  isClicked = (mousePosition) => {
    const distance = this.getDistanceFromLine(mousePosition);
    if (distance <= this.threshold) {
      const { id, onCornorPoint } = this.isMouseOnCornorPoint(mousePosition);
      if (onCornorPoint) {
        this.moveCornorPoint = id;
      }

      return true;
    }

    return false;
  };

  isInDragRange = (dragRanges) => {
    const { x1, y1, x2, y2 } = dragRanges;
    if (
      this.point1.x >= x1 &&
      this.point2.x >= x1 &&
      this.point1.x <= x2 &&
      this.point2.x <= x2 &&
      this.point1.y >= y1 &&
      this.point2.y >= y1 &&
      this.point1.y <= y2 &&
      this.point2.y <= y2
    ) {
      return true;
    } else {
      return false;
    }
  };

  isMouseOnCornorPoint = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;
    const centerX1 = this.point1.x;
    const centerY1 = this.point1.y;
    const centerX2 = this.point2.x;
    const centerY2 = this.point2.y;

    const isMouseOnStartPoint =
      mouseX >= centerX1 - this.dragCornerRectSize / 2 &&
      mouseX < centerX1 + this.dragCornerRectSize / 2 &&
      mouseY >= centerY1 - this.dragCornerRectSize / 2 &&
      mouseY < centerY1 + this.dragCornerRectSize / 2;

    const isMouseOnEndPoint =
      mouseX >= centerX2 - this.dragCornerRectSize / 2 &&
      mouseX < centerX2 + this.dragCornerRectSize / 2 &&
      mouseY >= centerY2 - this.dragCornerRectSize / 2 &&
      mouseY < centerY2 + this.dragCornerRectSize / 2;

    if (isMouseOnStartPoint || isMouseOnEndPoint) {
      return {
        id: isMouseOnStartPoint ? 1 : 2,
        onCornorPoint: true,
        point: {
          x: isMouseOnStartPoint ? centerX1 : centerX2,
          y: isMouseOnStartPoint ? centerY1 : centerY2,
        },
      };
    }

    return {
      id: -1,
      onCornorPoint: false,
      point: {},
    };
  };

  /**
   * 직선의 방정식을 이용해서 마우스의 x, y 값이 직선으로부터 얼마나 떨어져있는지 확인
   */
  getDistanceFromLine = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;
    const top = Math.min(this.point1.y, this.point2.y) - this.threshold / 2;
    const bottom = Math.max(this.point1.y, this.point2.y) + this.threshold / 2;
    const left = Math.min(this.point1.x, this.point2.x) - this.threshold / 2;
    const right = Math.max(this.point1.x, this.point2.x) + this.threshold / 2;

    if (mouseX < left || mouseX > right || mouseY < top || mouseY > bottom) {
      return this.threshold + 1;
    }

    const A = this.point2.y - this.point1.y;
    const B = this.point1.x - this.point2.x;
    const C = this.point2.x * this.point1.y - this.point1.x * this.point2.y;

    return Math.abs(A * mouseX + B * mouseY + C) / Math.sqrt(A * A + B * B);
  };

  openDragRange = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      this.point1.x + this.dragCornerRectSize / 2,
      this.point1.y + this.dragCornerRectSize / 2,
      -this.dragCornerRectSize,
      -this.dragCornerRectSize,
      4
    );
    ctx.roundRect(
      this.point2.x + this.dragCornerRectSize / 2,
      this.point2.y + this.dragCornerRectSize / 2,
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

  hoverCornorPoint = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(this.hoverEndpoint.x - 10, this.hoverEndpoint.y - 10, 20, 20, 10);
    ctx.fillStyle = "rgba(105, 105, 230, 0.5)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };

  draw = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(this.point1.x, this.point1.y);
    ctx.lineTo(this.point2.x, this.point2.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    if (this.hoverEndpoint) {
      this.hoverCornorPoint(ctx);
    }

    if (this.drag) {
      this.openDragRange(ctx);
    }
  };
}
