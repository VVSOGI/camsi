export class Sheep {
  constructor(img, stageWidth) {
    this.img = img;
    this.totalFrame = 8;
    this.curFrame = 0;

    this.imgWidth = 360;
    this.imgHeight = 300;

    this.sheepWidth = this.imgWidth / 4;
    this.sheepHeight = this.imgHeight / 4;
    this.sheepHalfWidth = this.sheepWidth / 2;

    this.x = stageWidth + this.sheepWidth;
    this.y = 0;
    this.speed = Math.random() + 1;

    this.fps = 24;
    this.fpsTime = 1000 / this.fps;
  }

  draw = (ctx, t, dots) => {
    if (!this.time) {
      this.time = t;
    }

    const now = t - this.time;
    if (now > this.fpsTime) {
      this.time = t;
      this.curFrame += 1;
      if (this.curFrame === this.totalFrame) {
        this.curFrame = 0;
      }
    }

    this.animate(ctx, dots);
  };

  animate = (ctx, dots) => {
    this.x = 700;
    this.y = 300;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.drawImage(
      this.img,
      this.imgWidth * this.curFrame,
      0,
      this.imgWidth,
      this.imgHeight,
      -this.sheepHalfWidth,
      -this.sheepHeight + 20,
      this.sheepWidth,
      this.sheepHeight
    );
    ctx.restore();
  };
}
