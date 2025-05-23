import { LineStorage } from "./lineStorage.js";
import { Drag } from "./drag.js";

class App {
  constructor() {
    this.container = document.querySelector(".container");
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);
    this.usermode = "default";
    this.dragStart = null;
    this.components = [];

    this.LineButton = document.querySelector(".line-button");
    this.LineStorage = new LineStorage();
    this.Drag = new Drag();

    this.resize();
    window.addEventListener("resize", this.resize);

    this.canvas.addEventListener("click", this.mouseClick);
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mouseup", this.mouseUp);

    this.LineButton.addEventListener("click", (e) => {
      this.usermode = "line";
    });

    requestAnimationFrame(this.draw);
  }

  getMousePoint = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const mousePosition = {
      mouseX: e.clientX - rect.left,
      mouseY: e.clientY - rect.top,
    };
    return mousePosition;
  };

  mouseUp = (e) => {
    if (this.usermode === "drag") {
      this.usermode = "default";
      this.dragStart = null;
    }
  };

  mouseDown = (e) => {
    const mousePosition = this.getMousePoint(e);
    const { mouseX, mouseY } = mousePosition;

    for (const component of this.components) {
      component.drag = false;
    }

    if (mouseX >= 0 && mouseY >= 0 && this.usermode === "default") {
      this.usermode = "drag";
      this.dragStart = mousePosition;
      this.Drag.tempPoint = null;
    }
  };

  mouseClick = (e) => {
    const mousePosition = this.getMousePoint(e);

    this.LineStorage.mouseClick(this.usermode, mousePosition, (line) => {
      this.usermode = "default";
      this.components.push(line);
    });
  };

  mouseMove = (e) => {
    /**
     * 사실 LineButton을 만들 필요는 없었는데, 이걸 굳이 만들어서 getBoundingClientRect의 쓰임새를 알게 됐다.
     * canvas가 좌측 상단 맨 위에 붙어있지 않을 경우에 그 차이만큼 계산해준다.
     */
    const mousePosition = this.getMousePoint(e);

    this.LineStorage.mouseMove(this.usermode, mousePosition);
    this.Drag.mouseMove(this.usermode, mousePosition);
  };

  resize = () => {
    this.stageWidth = this.container.clientWidth;
    this.stageHeight = this.container.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;

    this.LineStorage.resize(this.stageWidth, this.stageHeight);
    this.Drag.resize(this.stageWidth, this.stageHeight);
    this.ctx.scale(2, 2);
  };

  draw = (t) => {
    requestAnimationFrame(this.draw);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.LineStorage.draw(this.usermode, this.ctx);

    for (const component of this.components) {
      component.draw(this.ctx);
    }

    if (this.usermode === "drag") {
      const range = this.Drag.draw(this.ctx, this.dragStart);
      if (!range) return;

      const { x1, y1, x2, y2 } = range;
      for (const component of this.components) {
        if (component.x1 >= x1 && component.x2 <= x2 && component.y1 >= y1 && component.y2 <= y2) {
          component.drag = true;
        }
      }
    }
  };
}

window.onload = () => {
  new App();
};
