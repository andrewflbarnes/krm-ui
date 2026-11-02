// from https://github.com/thisbeyond/solid-dnd/blob/main/src/layout.ts
// project no longer maintained, need elementLayout for drag-overlay
interface Point {
  x: number;
  y: number;
}

class Layout {
  x;
  y;
  width;
  height;

  constructor(rect: { x: number; y: number; width: number; height: number }) {
    this.x = Math.floor(rect.x);
    this.y = Math.floor(rect.y);
    this.width = Math.floor(rect.width);
    this.height = Math.floor(rect.height);
  }

  get rect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  get left() {
    return this.x;
  }

  get top() {
    return this.y;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  get center(): Point {
    return {
      x: this.x + this.width * 0.5,
      y: this.y + this.height * 0.5,
    };
  }

  get corners(): {
    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;
  } {
    return {
      topLeft: { x: this.left, y: this.top },
      topRight: { x: this.right, y: this.top },
      bottomRight: { x: this.left, y: this.bottom },
      bottomLeft: { x: this.right, y: this.bottom },
    };
  }
}

const elementLayout = (element: HTMLElement): Layout => {
  let layout = new Layout(element.getBoundingClientRect());

  const { transform } = getComputedStyle(element);
  if (transform) {
    layout = stripTransformFromLayout(layout, transform);
  }

  return layout;
};

const stripTransformFromLayout = (
  layout: Layout,
  transform: string
): Layout => {
  let translateX, translateY;

  if (transform.startsWith("matrix3d(")) {
    const matrix = transform.slice(9, -1).split(/, /);
    translateX = +matrix[12];
    translateY = +matrix[13];
  } else if (transform.startsWith("matrix(")) {
    const matrix = transform.slice(7, -1).split(/, /);
    translateX = +matrix[4];
    translateY = +matrix[5];
  } else {
    translateX = 0;
    translateY = 0;
  }

  return new Layout({
    ...layout,
    x: layout.x - translateX,
    y: layout.y - translateY,
  });
};

export {
  elementLayout,
};
