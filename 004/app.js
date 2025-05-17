import { LineStorage } from "./lineStorage.js";
import { LineButton } from "./lineButton.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.LineButton = new LineButton();
    this.LineStorage = new LineStorage();

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("click", this.mouseClick);

    requestAnimationFrame(this.draw);
  }

  mouseClick = (e) => {
    this.LineStorage.mouseClick(e);
    this.LineButton.mouseClick(e, () => {
      this.LineStorage.active = true;
      this.LineStorage.tempPoint1 = {
        x: e.clientX,
        y: e.clientY,
      };
      this.canvas.style.cursor = "none";
    });
  };

  mouseMove = (e) => {
    this.LineStorage.mouseMove(e);
    this.LineButton.mouseMove(
      e,
      () => {
        this.LineButton.hover = true;
        this.canvas.style.cursor = "pointer";
      },
      () => {
        this.LineButton.hover = false;
        this.canvas.style.cursor = "";
      }
    );
  };

  resize = () => {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;

    this.LineStorage.resize(this.stageWidth, this.stageHeight);
    this.LineButton.resize(this.stageWidth, this.stageHeight);

    this.ctx.scale(2, 2);
  };

  draw = (t) => {
    requestAnimationFrame(this.draw);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.LineButton.draw(this.ctx);
    this.LineStorage.draw(this.ctx);
  };
}

window.onload = () => {
  new App();
};
