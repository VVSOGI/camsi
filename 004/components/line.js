export class Line {
  constructor(x1, y1, x2, y2) {
    this.id = new Date().getTime();

    const cx = Math.min(x1, x2) + Math.abs(x2 - x1) / 2;
    const cy = Math.min(y1, y2) + Math.abs(y2 - y1) / 2;

    this.originPoint = { x1, y1, cx, cy, x2, y2 };
    this.point = { x1, y1, cx, cy, x2, y2 };

    this.drag = false;
    this.hoverEndpoint = null;
    this.moveCornorPoint = -1;

    this.gap = 10;
    this.dragCornerRectSize = 10;
    this.threshold = 10;
  }

  initializeOriginPosition = () => {
    this.originPoint = {
      x1: this.point.x1,
      y1: this.point.y1,
      cx: this.point.cx,
      cy: this.point.cy,
      x2: this.point.x2,
      y2: this.point.y2,
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
      if (this.moveCornorPoint === 1) {
        this.point.x1 = this.originPoint.x1 + x;
        this.point.y1 = this.originPoint.y1 + y;
        this.hoverEndpoint = { x: this.point.x1, y: this.point.y1 };
      } else {
        this.point.x2 = this.originPoint.x2 + x;
        this.point.y2 = this.originPoint.y2 + y;
        this.hoverEndpoint = { x: this.point.x2, y: this.point.y2 };
      }

      this.point.cx = (this.point.x1 + this.point.x2) / 2;
      this.point.cy = (this.point.y1 + this.point.y2) / 2;
      return;
    }

    this.point = {
      x1: this.originPoint.x1 + x,
      y1: this.originPoint.y1 + y,
      x2: this.originPoint.x2 + x,
      y2: this.originPoint.y2 + y,
      cx: this.originPoint.cx + x,
      cy: this.originPoint.cy + y,
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
      this.point.x1 >= x1 &&
      this.point.x2 >= x1 &&
      this.point.x1 <= x2 &&
      this.point.x2 <= x2 &&
      this.point.y1 >= y1 &&
      this.point.y2 >= y1 &&
      this.point.y1 <= y2 &&
      this.point.y2 <= y2
    ) {
      return true;
    } else {
      return false;
    }
  };

  isMouseOnCornorPoint = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;
    const centerX1 = this.point.x1;
    const centerY1 = this.point.y1;
    const centerX2 = this.point.x2;
    const centerY2 = this.point.y2;

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
    const top = Math.min(this.point.y1, this.point.y2) - this.threshold / 2;
    const bottom = Math.max(this.point.y1, this.point.y2) + this.threshold / 2;
    const left = Math.min(this.point.x1, this.point.x2) - this.threshold / 2;
    const right = Math.max(this.point.x1, this.point.x2) + this.threshold / 2;

    if (mouseX < left || mouseX > right || mouseY < top || mouseY > bottom) {
      return this.threshold + 1;
    }

    const A = this.point.y2 - this.point.y1;
    const B = this.point.x1 - this.point.x2;
    const C = this.point.x2 * this.point.y1 - this.point.x1 * this.point.y2;

    return Math.abs(A * mouseX + B * mouseY + C) / Math.sqrt(A * A + B * B);
  };

  openDragRange = (ctx) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      this.point.x1 + this.dragCornerRectSize / 2,
      this.point.y1 + this.dragCornerRectSize / 2,
      -this.dragCornerRectSize,
      -this.dragCornerRectSize,
      4
    );
    ctx.roundRect(
      this.point.cx + this.dragCornerRectSize / 2,
      this.point.cy + this.dragCornerRectSize / 2,
      -this.dragCornerRectSize,
      -this.dragCornerRectSize,
      4
    );
    ctx.roundRect(
      this.point.x2 + this.dragCornerRectSize / 2,
      this.point.y2 + this.dragCornerRectSize / 2,
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
    ctx.moveTo(this.point.x1, this.point.y1);
    ctx.lineTo(this.point.cx, this.point.cy);
    ctx.lineTo(this.point.x2, this.point.y2);
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
