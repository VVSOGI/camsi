export class Drag {
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
    const { mouseX, mouseY } = mousePosition;

    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(this.tempPoint.x, this.tempPoint.y);
    ctx.stroke();
    ctx.closePath();
  };
}
