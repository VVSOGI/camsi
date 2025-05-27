import { LineStorage } from "./lineStorage.js";
import { Drag } from "./drag.js";
import { ComponentManager } from "./component.js";

class App {
  constructor() {
    this.container = document.querySelector(".container");
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);
    this.usermode = "default";
    this.dragStart = null;
    this.moveStart = null;

    this.LineButton = document.querySelector(".line-button");
    this.ComponentManager = new ComponentManager();
    this.LineStorage = new LineStorage();
    this.Drag = new Drag();

    this.resize();
    window.addEventListener("resize", this.resize);

    this.canvas.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mousemove", this.mouseMove);
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
    const mousePosition = this.getMousePoint(e);

    const isDefaultModeNotDrag =
      this.usermode === "drag" &&
      this.dragStart.mouseX === mousePosition.mouseX &&
      this.dragStart.mouseY === mousePosition.mouseY;

    const isDefaultModeNotMove =
      this.usermode === "move" &&
      this.moveStart.mouseX === mousePosition.mouseX &&
      this.moveStart.mouseY === mousePosition.mouseY;

    if (isDefaultModeNotDrag) {
      this.ComponentManager.initializeSelectedComponents();
    }

    if (isDefaultModeNotMove) {
      const component = this.ComponentManager.findComponentWithPosition(mousePosition);
      if (component) {
        this.ComponentManager.selectComponent(component);
      }
    }

    if (this.usermode === "drag" || this.usermode === "move") {
      this.usermode = "default";
      this.moveStart = null;
      this.dragStart = null;
      this.ComponentManager.initializeOriginPosition();
    }

    this.LineStorage.mouseClick(this.usermode, mousePosition, (line) => {
      this.usermode = "default";
      this.ComponentManager.push(line);
    });
  };

  mouseDown = (e) => {
    const mousePosition = this.getMousePoint(e);
    const { mouseX, mouseY } = mousePosition;

    const component = this.ComponentManager.findComponentWithPosition(mousePosition);
    if (component) {
      if (!this.ComponentManager.isSelected(component)) {
        this.ComponentManager.selectComponent(component);
      }
      this.usermode = "move";
      this.moveStart = {
        mouseX,
        mouseY,
      };
      return;
    }

    if (mouseX >= 0 && mouseY >= 0 && this.usermode === "default") {
      this.usermode = "drag";
      this.dragStart = mousePosition;
      this.Drag.tempPoint = null;
    }
  };

  mouseMove = (e) => {
    const mousePosition = this.getMousePoint(e);

    if (this.canvas.style.cursor === "move") {
      this.canvas.style.cursor = "default";
    }

    this.LineStorage.mouseMove(this.usermode, mousePosition);
    this.Drag.mouseMove(this.usermode, mousePosition);
    this.ComponentManager.hoverComponent(mousePosition, () => {
      this.canvas.style.cursor = "move";
    });

    if (this.usermode === "move") {
      this.ComponentManager.moveComponent(mousePosition, this.moveStart);
    }
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
    this.ComponentManager.draw(this.ctx);

    if (this.usermode === "drag") {
      const range = this.Drag.draw(this.ctx, this.dragStart);
      if (!range) return;

      this.ComponentManager.dragComponents(range);
    }
  };
}

window.onload = () => {
  new App();
};
