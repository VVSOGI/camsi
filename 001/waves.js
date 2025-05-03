import { Wave } from "./wave.js";

export class Waves {
  constructor() {
    this.totalPoints = 8;

    this.colors = ["#0084ff", "#e77272", "#17b3e6"];
    this.waves = [];

    for (let i = 0; i < this.colors.length; i++) {
      const wave = new Wave(i, this.totalPoints, this.colors[i]);
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
