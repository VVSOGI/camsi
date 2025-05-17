export class LineButton {
  constructor() {
    this.rectWidth = 100;
    this.rectHeight = 50;
    this.lineWidth = 5;
    this.fontSize = 24;
    this.hover = false;
    this.active = false;
  }

  resize = (stageWidth, stageHeight) => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  };

  draw = (ctx) => {
    const startX = this.stageWidth / 2 - this.rectWidth / 2;
    const startY = 50;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + this.rectWidth, startY);
    ctx.lineTo(startX + this.rectWidth, startY + this.rectHeight);
    ctx.lineTo(startX, startY + this.rectHeight);
    ctx.lineTo(startX, startY);
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = this.hover ? "#6d9edf" : "white";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.font = `bold ${this.fontSize}px sans`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.hover ? "white" : "black";
    ctx.fillText("Line", startX + this.rectWidth / 2, startY + this.rectHeight / 2 + this.lineWidth / 2);
    ctx.closePath();

    this.position = {
      x1: startX,
      y1: startY,
      x2: startX + this.rectWidth,
      y2: startY + this.rectHeight,
    };
  };
}
