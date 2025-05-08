import { Hill } from "./hill.js";
import { SheepController } from "./sheep-controller.js";
import { Sun } from "./sun.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.hills = [
      new Hill("#b63125", 0.2, 14), //
      new Hill("#d09f76", 0.5, 8),
      new Hill("#427956", 1.8, 6),
    ];

    this.sheepController = new SheepController(this.canvas);
    this.sun = new Sun();

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
    this.sun.resize(this.stageWidth, this.stageHeight);

    for (const hill of this.hills) {
      hill.resize(this.stageWidth, this.stageHeight);
    }

    this.sheepController.resize(this.stageWidth, this.stageHeight);
  };

  animate = (t) => {
    requestAnimationFrame(this.animate);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.sun.animate(t, this.ctx);

    let dots;
    for (const hill of this.hills) {
      dots = hill.draw(this.ctx);
    }

    this.sheepController.draw(this.ctx, t, dots);
  };
}

window.onload = () => {
  new App();
};
