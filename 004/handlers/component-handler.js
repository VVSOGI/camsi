export class ComponentHandler {
  constructor() {
    this.components = [];
    this.selectedComponents = new Set();
  }

  draw = (ctx) => {
    for (const component of this.components) {
      component.draw(ctx);
    }
  };

  push = (component) => {
    this.components.push(component);
  };

  getComponents = () => {
    return this.components;
  };

  getSelectedComponents = () => {
    return this.selectedComponents;
  };

  isSelected = (component) => {
    return this.selectedComponents.has(component);
  };

  dragComponents = (dragRanges) => {
    for (const component of this.components) {
      if (component.isInDragRange(dragRanges)) {
        component.drag = true;
        this.selectedComponents.add(component);
      } else {
        if (component.drag) {
          component.drag = false;
          this.selectedComponents.delete(component);
        }
      }
    }
  };

  selectComponent = (component) => {
    this.initializeSelectedComponents();
    this.selectedComponents.add(component);
    component.drag = true;
  };

  hoverComponent = (mousePosition, canvas) => {
    for (const component of this.components) {
      component.onHover(mousePosition, canvas);
    }
  };

  moveComponent = (mousePosition, moveStart) => {
    for (const component of this.selectedComponents) {
      const move = {
        x: mousePosition.mouseX - moveStart.mouseX,
        y: mousePosition.mouseY - moveStart.mouseY,
      };
      component.onMove(move);
    }
  };

  mouseUp = () => {
    for (const component of this.selectedComponents) {
      component.onMouseUp();
    }
  };

  findComponentWithPosition = (mousePosition) => {
    for (const component of this.components) {
      if (component.isClicked(mousePosition)) {
        return component;
      }
    }

    return null;
  };

  initializeSelectedComponents = () => {
    for (const component of this.selectedComponents) {
      component.drag = false;
    }
    this.selectedComponents = new Set();
  };
}
