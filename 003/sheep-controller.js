import { Sheep } from "./sheep.js";

export class SheepController {
  constructor() {
    this.img = new Image();
    this.img.src = "./images/sheep.png";
    this.img.onload = () => {
      this.loaded();
    };
    this.items = [];

    this.cur = 0;
    this.isLoaded = false;
  }

  resize = (stageWidth, stageHeight) => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  };

  loaded = () => {
    this.isLoaded = true;
    this.addSheep();
  };

  addSheep = () => {
    this.items.push(new Sheep(this.img, this.stageWidth));
  };

  draw = (ctx, t, dots) => {
    if (this.isLoaded) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].draw(ctx, t, dots);
      }
    }
  };
}
