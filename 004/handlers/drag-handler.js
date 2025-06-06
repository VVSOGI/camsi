export class DragHandler {
  constructor() {
    this.modeType = "drag";
    this.tempPoint = null;
  }

  resize = (stageWidth, stageHeight) => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  };

  mouseMove = (usermode, mousePosition) => {
    if (usermode === this.modeType) {
      const { mouseX, mouseY } = mousePosition;
      this.tempPoint = {
        x: mouseX,
        y: mouseY,
      };
    }
  };

  draw = (ctx, mousePosition) => {
    if (!this.tempPoint) return;

    const { mouseX, mouseY } = mousePosition;

    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(this.tempPoint.x, mouseY);
    ctx.lineTo(this.tempPoint.x, this.tempPoint.y);
    ctx.lineTo(mouseX, this.tempPoint.y);
    ctx.lineTo(mouseX, mouseY);
    ctx.fill();
    ctx.fillStyle = "rgba(105, 105, 230, 0.1)";
    ctx.strokeStyle = "rgba(105, 105, 230)";
    ctx.stroke();
    ctx.closePath();

    const left = Math.min(mouseX, this.tempPoint.x);
    const top = Math.min(mouseY, this.tempPoint.y);
    const right = Math.max(mouseX, this.tempPoint.x);
    const bottom = Math.max(mouseY, this.tempPoint.y);

    return {
      x1: left,
      y1: top,
      x2: right,
      y2: bottom,
    };
  };
}
