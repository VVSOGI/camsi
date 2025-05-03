export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = (Math.random() * 2 - 1) * (Math.random() * 300) + y;
    this.fiexdX = x;
    this.speed = 1;
    this.cur = 0;
  }
}
