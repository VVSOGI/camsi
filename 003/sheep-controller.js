import { Sheep } from "./sheep.js";

export class SheepController {
  constructor(canvas) {
    this.img = new Image();
    this.img.src = "./images/sheep.png";

    this.shiverImg = new Image();
    this.shiverImg.src = "./images/shiver.png";
    this.shiverImg.onload = () => {
      this.loaded();
    };

    this.sheeps = [];

    this.canvas = canvas;
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.defaultCursor = this.canvas.style.cursor;

    this.cur = 0;
    this.isLoaded = false;
    this.isMouseDown = false;
    this.activeSheep = null;

    this.mouseX = 0;
    this.mouseY = 0;
  }

  onMouseUp = (e) => {
    this.isMouseDown = false;
    if (this.activeSheep) {
      this.activeSheep.handleGrabDown();
      this.activeSheep = null;
    }

    this.onMouseMove(e);
  };

  onMouseDown = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.isMouseDown = true;

    const clickedSheep = this.isCursorOverSheep(x, y);

    if (clickedSheep) {
      this.activeSheep = clickedSheep;
      this.canvas.style.cursor = "grabbing";
      clickedSheep.handleGrabUp();
    }
  };

  onMouseMove = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.mouseX = x;
    this.mouseY = y;

    const isOverSheep = this.isCursorOverSheep(x, y);

    if (this.activeSheep) {
      this.canvas.style.cursor = "grabbing";
    } else if (isOverSheep) {
      this.canvas.style.cursor = "grab";
    } else {
      this.canvas.style.cursor = this.defaultCursor;
    }
  };

  isCursorOverSheep = (x, y) => {
    for (let i = this.sheeps.length - 1; i >= 0; i--) {
      const sheep = this.sheeps[i];
      if (sheep.isPointInside(x, y)) {
        return sheep;
      }
    }

    return null;
  };

  resize = (stageWidth, stageHeight) => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  };

  loaded = () => {
    this.isLoaded = true;
    this.addSheep();
  };

  addSheep = () => {
    const sheep = new Sheep(this.img, this.shiverImg, this.stageWidth);
    this.sheeps.push(sheep);
  };

  draw = (ctx, t, dots) => {
    if (this.isLoaded) {
      this.cur += 1;
      if (this.cur > 300) {
        this.cur = 0;
        this.addSheep();
      }

      for (let i = 0; i < this.sheeps.length; i++) {
        const item = this.sheeps[i];
        if (item.x < -item.sheepWidth) this.sheeps.splice(i, 1);
        item.draw(ctx, t, dots, this.mouseX, this.mouseY);
      }
    }
  };
}
