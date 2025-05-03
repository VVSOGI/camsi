import { Point } from "./point.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    window.addEventListener("resize", this.resize);
    this.resize();

    requestAnimationFrame(this.animate);
  }

  init = () => {
    this.totalPoints = 7;
    this.points = [];
    this.gap = this.stageWidth / this.totalPoints;

    for (let i = 0; i <= this.totalPoints; i++) {
      this.points[i] = new Point(i * this.gap, this.stageHeight / 2);
    }
  };

  resize = () => {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    this.init();
  };

  animate = (t) => {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.ctx.beginPath();
    let prev = this.points[0];

    for (let i = 1; i < this.points.length; i++) {
      const cx = (prev.x + this.points[i].x) / 2;
      const cy = (prev.y + this.points[i].y) / 2;
      this.ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
      prev = this.points[i];
    }

    this.ctx.quadraticCurveTo(
      prev.x,
      prev.y,
      this.points[this.points.length - 1].x,
      this.points[this.points.length - 1].y
    );
    this.ctx.lineTo(this.stageWidth, this.stageHeight);
    this.ctx.lineTo(0, this.stageHeight);
    this.ctx.fillStyle = "#04b6fd";
    this.ctx.fill();

    this.ctx.closePath();

    requestAnimationFrame(this.animate);
  };
}

window.onload = () => {
  new App();
};
