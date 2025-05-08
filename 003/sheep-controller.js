import { Sheep } from "./sheep.js";

export class SheepController {
  constructor(canvas) {
    this.img = new Image();
    this.img.src = "./images/sheep.png";
    this.img.onload = () => {
      this.loaded();
    };
    this.sheeps = [];

    this.canvas = canvas;
    this.canvas.addEventListener("click", this.onClickSheep);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.defaultCursor = this.canvas.style.cursor;

    this.cur = 0;
    this.isLoaded = false;
  }

  onMouseMove = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const isOverSheep = this.isCursorOverSheep(x, y);

    if (isOverSheep) {
      this.canvas.style.cursor = "grab";
    } else {
      this.canvas.style.cursor = this.defaultCursor;
    }
  };

  onClickSheep = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.checkSheepClicked(x, y);
  };

  isCursorOverSheep = (x, y) => {
    for (let i = this.sheeps.length - 1; i >= 0; i--) {
      const sheep = this.sheeps[i];
      if (sheep.isPointInside(x, y)) {
        return true;
      }
    }

    return false;
  };

  checkSheepClicked = (x, y) => {
    for (let i = this.sheeps.length - 1; i >= 0; i--) {
      const sheep = this.sheeps[i];
      if (sheep.isPointInside(x, y)) {
        sheep.handleClick(x, y);
        console.log(x, y);
        break;
      }
    }
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
    const sheep = new Sheep(this.img, this.stageWidth);
    sheep.setClickCallback((callback) => {
      console.log("Sheep clicked!", callback);
    });
    this.sheeps.push(sheep);
  };

  draw = (ctx, t, dots) => {
    if (this.isLoaded) {
      this.cur += 1;
      if (this.cur > 500) {
        this.cur = 0;
        this.addSheep();
      }

      for (let i = 0; i < this.sheeps.length; i++) {
        const item = this.sheeps[i];
        if (item.x < -item.imgWidth) {
          this.sheeps.splice(i, 1);
        } else {
          item.draw(ctx, t, dots);
        }
      }
    }
  };
}
