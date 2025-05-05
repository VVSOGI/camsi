class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    window.addEventListener("resize", this.resize);
    this.resize();

    requestAnimationFrame(this.animate);
  }

  resize = () => {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);
  };

  animate = (t) => {
    requestAnimationFrame(this.animate);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  };
}
