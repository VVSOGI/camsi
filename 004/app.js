import { LineButton } from "./lineButton.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.LineButton = new LineButton();

    window.addEventListener("resize", this.resize);
    this.resize();

    window.addEventListener("mousemove", this.mouseMove);

    requestAnimationFrame(this.draw);
  }

  handleClickLineButton = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const { x1, y1, x2, y2 } = this.LineButton.position;

    if (mouseX >= x1 && mouseX < x2 && mouseY >= y1 && mouseY < y2) {
      this.LineButton.active = true;
    }
  };

  mouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const { x1, y1, x2, y2 } = this.LineButton.position;

    if (mouseX >= x1 && mouseX < x2 && mouseY >= y1 && mouseY < y2) {
      this.LineButton.hover = true;
      this.canvas.style.cursor = "pointer";
    } else {
      this.LineButton.hover = false;
      this.canvas.style.cursor = "";
    }
  };

  resize = () => {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;

    this.LineButton.resize(this.stageWidth, this.stageHeight);

    this.ctx.scale(2, 2);
  };

  draw = (t) => {
    requestAnimationFrame(this.draw);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.LineButton.draw(this.ctx);
  };
}

window.onload = () => {
  new App();
};
