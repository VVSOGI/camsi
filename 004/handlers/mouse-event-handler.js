export class MouseEventHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this.mode = "default";
    this.dragStart = null;
    this.moveStart = null;
  }

  getMode = () => {
    return this.mode;
  };

  getMousePoint = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const mousePosition = {
      mouseX: e.clientX - rect.left,
      mouseY: e.clientY - rect.top,
    };
    return mousePosition;
  };

  getEntryPoint = () => {
    return {
      dragStart: this.dragStart,
      moveStart: this.moveStart,
    };
  };

  getIsStaticClickNotDrag = (mousePosition) => {
    return (
      this.mode === "drag" &&
      this.dragStart.mouseX === mousePosition.mouseX &&
      this.dragStart.mouseY === mousePosition.mouseY
    );
  };

  getIsStaticClickNotMove = (mousePosition) => {
    return (
      this.mode === "move" &&
      this.moveStart.mouseX === mousePosition.mouseX &&
      this.moveStart.mouseY === mousePosition.mouseY
    );
  };

  setMode = (mode) => {
    this.mode = mode;
  };

  setDragStart = (mousePosition) => {
    this.dragStart = mousePosition;
  };

  setMoveStart = (mousePosition) => {
    this.moveStart = mousePosition;
  };

  initializeEntryPointer = () => {
    this.mode = "default";
    this.moveStart = null;
    this.dragStart = null;
  };
}
