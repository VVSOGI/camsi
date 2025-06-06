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
    const { x1, y1, x2, y2 } = dragRanges;

    for (const component of this.components) {
      if (
        component.x1 >= x1 &&
        component.x2 >= x1 &&
        component.x1 <= x2 &&
        component.x2 <= x2 &&
        component.y1 >= y1 &&
        component.y2 >= y1 &&
        component.y1 <= y2 &&
        component.y2 <= y2
      ) {
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

  hoverComponent = (mousePosition, onHover) => {
    for (const component of this.components) {
      const hover = component.onHover(mousePosition);
      if (hover) {
        onHover();
      }
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

  initializeOriginPosition = () => {
    for (const component of this.selectedComponents) {
      component.initializeOriginPosition();
    }
  };
}
