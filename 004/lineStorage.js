import { Line } from "./line.js";

export class LineStorage {
  constructor() {
    this.modeType = "line";
    this.tempPoint1 = null;
    this.tempPoint2 = null;
    this.point1 = null;
    this.point2 = null;
  }

  resize = (stageWidth, stageHeight) => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  };

  mouseClick = (usermode, mousePosition, callback) => {
    if (usermode === this.modeType) {
      const { mouseX, mouseY } = mousePosition;
      if (!this.point1) {
        this.point1 = {
          x: mouseX,
          y: mouseY,
        };
        this.tempPoint2 = {
          x: mouseX,
          y: mouseY,
        };
        return;
      }

      const line = new Line(this.point1.x, this.point1.y, this.tempPoint2.x, this.tempPoint2.y);

      this.point1 = null;
      this.point2 = null;
      this.tempPoint1 = null;
      this.tempPoint2 = null;
      callback(line);
    }
  };

  mouseMove = (usermode, mousePosition) => {
    if (usermode === this.modeType) {
      const { mouseX, mouseY } = mousePosition;
      if (!this.point1) {
        this.tempPoint1 = {
          x: mouseX,
          y: mouseY,
        };

        return;
      }

      if (!this.point2) {
        this.tempPoint2 = {
          x: mouseX,
          y: mouseY,
        };
      }
    }
  };

  draw = (usermode, ctx) => {
    if (usermode === this.modeType && this.tempPoint1) {
      ctx.beginPath();
      ctx.arc(this.tempPoint1.x, this.tempPoint1.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    }

    if (usermode === this.modeType && this.tempPoint2) {
      ctx.beginPath();
      ctx.arc(this.tempPoint2.x, this.tempPoint2.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(this.tempPoint1.x, this.tempPoint1.y);
      ctx.lineTo(this.tempPoint2.x, this.tempPoint2.y);
      ctx.stroke();
      ctx.strokeStyle = "black";
      ctx.fill();
      ctx.closePath();
    }
  };
}
