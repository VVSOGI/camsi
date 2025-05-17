export class LineStorage {
  constructor() {
    this.active = false;
    this.tempPoint1 = null;
    this.tempPoint2 = null;
    this.point1 = null;
    this.point2 = null;

    /**
     * 두 점의 좌표들의 모음
     */
    this.storage = new Set();
  }

  resize = (stageWidth, stageHeight) => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight = stageHeight;
  };

  mouseClick = (e) => {
    if (this.active) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
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

      this.storage.add([this.point1.x, this.point1.y, this.tempPoint2.x, this.tempPoint2.y]);
      this.point1 = null;
      this.point2 = null;
      this.tempPoint1 = null;
      this.tempPoint2 = null;
      this.active = false;
    }
  };

  mouseMove = (e, ctx) => {
    if (this.active) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
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

  draw = (ctx) => {
    if (this.active && this.tempPoint1) {
      ctx.beginPath();
      ctx.arc(this.tempPoint1.x, this.tempPoint1.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    }

    if (this.active && this.tempPoint2) {
      ctx.beginPath();
      ctx.moveTo(this.tempPoint1.x, this.tempPoint1.y);
      ctx.lineTo(this.tempPoint2.x, this.tempPoint2.y);
      ctx.stroke();

      ctx.arc(this.tempPoint2.x, this.tempPoint2.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    }

    for (const [x1, y1, x2, y2] of this.storage) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };
}
