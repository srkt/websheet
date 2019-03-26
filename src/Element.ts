export class Element {
  element: HTMLElement;
  /**
   *
   */
  constructor(
    tagName: string,
    type?: string,
    className?: string,
    styles?: object
  ) {
    this.element = document.createElement(tagName);

    if (type) {
      this.element.setAttribute("type", type);
    }

    if (className) {
      this.element.className = this.element.className + " " + className;
    }

    if (styles) {
      Object.keys(styles).forEach((s, j) => {
        (<any>this.element.style)[s] = (<any>styles)[s];
      });
    }
  }

  addChild(element: Element) {
    this.element.appendChild(element.element);
    return this;
  }

  addChildren(...elements: Element[]) {
    elements.forEach(e => {
      this.addChild(e);
    });
    return this;
  }

  static New(
    tagName: string,
    type?: string,
    className?: string,
    styles?: object
  ) {
    return new Element(tagName, type, className,styles);
  }
}
