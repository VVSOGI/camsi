import { LineStorage } from "./lineStorage.js";
import { LineButton } from "./lineButton.js";

class App {
  constructor() {
    this.container = document.querySelector(".container");
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);

    this.LineButton = new LineButton();
    this.LineStorage = new LineStorage();

    this.resize();
    window.addEventListener("resize", this.resize);
    this.canvas.addEventListener("mousemove", this.mouseMove);
    this.canvas.addEventListener("click", this.mouseClick);

    requestAnimationFrame(this.draw);
  }

  mouseClick = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const mousePosition = {
      mouseX: e.clientX - rect.left,
      mouseY: e.clientY - rect.top,
    };

    this.LineStorage.mouseClick(mousePosition);
    this.LineButton.mouseClick(mousePosition, () => {
      this.LineStorage.active = true;
      this.LineStorage.tempPoint1 = {
        x: mousePosition.mouseX,
        y: mousePosition.mouseY,
      };
      this.canvas.style.cursor = "none";
    });
  };

  mouseMove = (e) => {
    /**
     * 사실 LineButton을 만들 필요는 없었는데, 이걸 굳이 만들어서 getBoundingClientRect의 쓰임새를 알게 됐다.
     * canvas가 좌측 상단 맨 위에 붙어있지 않을 경우에 그 차이만큼 계산해준다.
     */
    const rect = this.canvas.getBoundingClientRect();
    const mousePosition = {
      mouseX: e.clientX - rect.left,
      mouseY: e.clientY - rect.top,
    };

    this.LineStorage.mouseMove(mousePosition);
    this.LineButton.mouseMove(
      mousePosition,
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
    this.stageWidth = this.container.clientWidth;
    this.stageHeight = this.container.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;

    this.LineStorage.resize(this.stageWidth, this.stageHeight);
    this.LineButton.resize(this.stageWidth, this.stageHeight);

    this.ctx.scale(2, 2);
  };

  draw = (t) => {
    requestAnimationFrame(this.draw);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.LineStorage.draw(this.ctx);
    this.LineButton.draw(this.ctx);
  };
}

window.onload = () => {
  new App();
};
