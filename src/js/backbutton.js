class BackButton {
  #stack = [];

  constructor() {
    document.addEventListener("backbutton", this.#handle);
  }

  #handle(e) {
    e.preventDefault();
    this.#stack.pop()?.();
  }

  listen(fn) {
    this.#stack.push(fn);
  }
}

export const backbutton = new BackButton();
