import { Hill } from "./hill.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.hills = [new Hill("#fd6bea", 0.2, 12), new Hill("#ff59c2", 0.5, 8), new Hill("#ff4674", 1.4, 6)];

    window.addEventListener("resize", this.resize);
    this.resize();

    requestAnimationFrame(this.animate);
  }

  resize = () => {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    for (const hill of this.hills) {
      hill.resize(this.stageWidth, this.stageHeight);
    }
  };

  animate = (t) => {
    requestAnimationFrame(this.animate);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    let dots;
    for (const hill of this.hills) {
      dots = hill.draw(this.ctx);
    }
  };
}

window.onload = () => {
  new App();
};
