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
    this.hoverEndpoint = null;
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
      const { result, point } = this.isMouseOnCornorPoint(mousePosition);
      if (result) {
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

    this.x1 = this.originX1 + x;
    this.y1 = this.originY1 + y;
    this.x2 = this.originX2 + x;
    this.y2 = this.originY2 + y;
  };

  isClicked = (mousePosition) => {
    const distance = this.getDistanceFromLine(mousePosition);
    if (distance <= this.threshold) {
      return true;
    }

    return false;
  };

  isMouseOnCornorPoint = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;
    const centerX1 = this.x1;
    const centerY1 = this.y1;
    const centerX2 = this.x2;
    const centerY2 = this.y2;

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
        result: true,
        point: {
          x: isMouseOnStartPoint ? centerX1 : centerX2,
          y: isMouseOnStartPoint ? centerY1 : centerY2,
        },
      };
    } else {
      return {
        result: false,
        point: {},
      };
    }
  };

  /**
   * 직선의 방정식을 이용해서 마우스의 x, y 값이 직선으로부터 얼마나 떨어져있는지 확인
   */
  getDistanceFromLine = (mousePosition) => {
    const { mouseX, mouseY } = mousePosition;
    const top = Math.min(this.y1, this.y2) - this.threshold / 2;
    const bottom = Math.max(this.y1, this.y2) + this.threshold / 2;
    const left = Math.min(this.x1, this.x2) - this.threshold / 2;
    const right = Math.max(this.x1, this.x2) + this.threshold / 2;

    if (mouseX < left || mouseX > right || mouseY < top || mouseY > bottom) {
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
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
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
