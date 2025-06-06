import { LineHandler, DragHandler, ComponentHandler, MouseEventHandler } from "./handlers/index.js";

class App {
  constructor() {
    this.container = document.querySelector(".container");
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);

    this.LineButton = document.querySelector(".line-button");

    this.Drag = new DragHandler();
    this.LineStorage = new LineHandler();
    this.mouseEvent = new MouseEventHandler(this.canvas);
    this.ComponentManager = new ComponentHandler();

    this.resize();
    window.addEventListener("resize", this.resize);

    this.canvas.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mouseup", this.mouseUp);
    this.LineButton.addEventListener("click", () => {
      this.mouseEvent.setMode("line");
    });

    requestAnimationFrame(this.draw);
  }

  mouseUp = (e) => {
    const mouseMode = this.mouseEvent.getMode();
    const mousePosition = this.mouseEvent.getMousePoint(e);

    if (this.mouseEvent.getIsStaticClickNotDrag(mousePosition)) {
      this.ComponentManager.initializeSelectedComponents();
    }

    if (this.mouseEvent.getIsStaticClickNotMove(mousePosition)) {
      const component = this.ComponentManager.findComponentWithPosition(mousePosition);
      if (component) {
        this.ComponentManager.selectComponent(component);
      }
    }

    if (mouseMode === "drag" || mouseMode === "move") {
      this.mouseEvent.initializeEntryPointer();
      this.ComponentManager.initializeOriginPosition();
    }

    if (mouseMode === "line") {
      this.LineStorage.mouseClick(mouseMode, mousePosition, (line) => {
        this.mouseEvent.setMode("default");
        this.ComponentManager.push(line);
      });
    }
  };

  mouseDown = (e) => {
    const mouseMode = this.mouseEvent.getMode();
    const mousePosition = this.mouseEvent.getMousePoint(e);
    const { mouseX, mouseY } = mousePosition;

    const component = this.ComponentManager.findComponentWithPosition(mousePosition);
    if (component) {
      if (!this.ComponentManager.isSelected(component)) {
        this.ComponentManager.selectComponent(component);
      }
      this.mouseEvent.setMode("move");
      this.mouseEvent.setMoveStart(mousePosition);
      return;
    }

    if (mouseX >= 0 && mouseY >= 0 && mouseMode === "default") {
      this.mouseEvent.setMode("drag");
      this.mouseEvent.setDragStart(mousePosition);
      this.Drag.tempPoint = null;
    }
  };

  mouseMove = (e) => {
    const mousePosition = this.mouseEvent.getMousePoint(e);
    const mouseMode = this.mouseEvent.getMode();
    const { moveStart } = this.mouseEvent.getEntryPoint();

    if (this.canvas.style.cursor === "move" || this.canvas.style.cursor === "pointer") {
      this.canvas.style.cursor = "default";
    }

    this.LineStorage.mouseMove(mouseMode, mousePosition);
    this.Drag.mouseMove(mouseMode, mousePosition);
    this.ComponentManager.hoverComponent(mousePosition, this.canvas);

    if (mouseMode === "move") {
      this.ComponentManager.moveComponent(mousePosition, moveStart);
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
    const mouseMove = this.mouseEvent.getMode();
    const { dragStart } = this.mouseEvent.getEntryPoint();

    requestAnimationFrame(this.draw);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.LineStorage.draw(mouseMove, this.ctx);
    this.ComponentManager.draw(this.ctx);

    if (mouseMove === "drag") {
      const range = this.Drag.draw(this.ctx, dragStart);
      if (!range) return;

      this.ComponentManager.dragComponents(range);
    }
  };
}

window.onload = () => {
  new App();
};
