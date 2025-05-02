import { Wave } from "./wave.js";

export class Waves {
  constructor() {
    this.totalPoints = 8;

    this.colors = ["rgba(0,199,235,0.4)", "rgba(0,146,199,0.4)", "rgba(0,87,158,0.4)"];
    this.waves = [];

    for (let i = 0; i < this.colors.length; i++) {
      const wave = new Wave(i, this.totalPoints, this.colors[0]);
      this.waves[i] = wave;
    }
  }

  resize(stageWidth, stageHeight) {
    for (let i = 0; i < this.waves.length; i++) {
      const wave = this.waves[i];
      wave.resize(stageWidth, stageHeight);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.waves.length; i++) {
      const wave = this.waves[i];
      wave.draw(ctx);
    }
  }
}
