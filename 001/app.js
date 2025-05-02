import { Wave } from "./wave.js";
import { Waves } from "./waves.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.waves = new Waves();

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

    this.waves.resize(this.stageWidth, this.stageHeight);
  };

  animate = (t) => {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.waves.draw(this.ctx);
    requestAnimationFrame(this.animate);
  };
}

window.onload = () => {
  new App();
};
