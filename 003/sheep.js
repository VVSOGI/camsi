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
    this.speed = Math.random() + 0.5;

    this.fps = 24;
    this.fpsTime = 1000 / this.fps;

    this.isClicked = false;
    this.clickCallback = null;
  }

  handleClick(x, y) {
    this.isClicked = true;

    if (this.clickCallback) {
      this.clickCallback(this);
    }
  }

  setClickCallback(callback) {
    this.clickCallback = callback;
  }

  isPointInside(x, y) {
    const centerX = this.x - this.sheepHalfWidth;
    const centerY = this.y - (this.sheepHeight / 2 + 20);

    return x >= centerX && x <= centerX + this.sheepWidth && y >= centerY && y <= centerY + this.sheepHeight;
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
    this.x -= this.speed;
    const current = this.getY(this.x, dots);
    if (!current) return;
    this.y = current.y;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(current.rotation);
    ctx.beginPath();
    ctx.rect(-this.sheepHalfWidth, -(this.sheepHeight / 2 + 20), this.sheepWidth, this.sheepHeight);
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    ctx.fill();

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

  getY = (x, dots) => {
    for (let i = 1; i < dots.length; i++) {
      if (x >= dots[i].x1 && x <= dots[i].x3) {
        return this.getY2(x, dots[i]);
      }
    }
  };

  getY2 = (x, dot) => {
    let point = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, 0);
    let prevX = point.x;
    for (let i = 1; i < 200; i++) {
      const t = i / 200;
      point = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, t);
      if (x >= prevX && x <= point.x) {
        return point;
      }

      prevX = point.x;
    }

    return point;
  };

  getPointOnQuad = (x1, y1, x2, y2, x3, y3, t) => {
    const tx = this.getQuadTangent(x1, x2, x3, t);
    const ty = this.getQuadTangent(y1, y2, y3, t);
    const rotation = Math.atan2(ty, tx);

    return {
      x: this.getQuadPoint(x1, x2, x3, t),
      y: this.getQuadPoint(y1, y2, y3, t),
      rotation,
    };
  };

  getQuadPoint = (p0, p1, p2, t) => {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  };

  getQuadTangent(p0, p1, p2, t) {
    return 2 * (1 - t) * (p1 - p0) + 2 * (p2 - p1) * t;
  }
}
