import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.rootContainer = document.querySelector('.header.container');

    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, { once: true });
    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    const isElemVisible = this.elem.className.includes('cart-icon_visible');

    if (!isElemVisible || document.documentElement.clientWidth < 767) {
      return;
    }

    const { right } = this.rootContainer.getBoundingClientRect();
    const topOffset = 50;
    const rightContainerOffset = 20;
    const hasFreePlaceForIcon = document.documentElement.clientWidth > right + rightContainerOffset + this.elem.offsetWidth + 10;
    const leftOffset = right + rightContainerOffset;
    const resizeLeftOffset = document.documentElement.clientWidth - 10 - this.elem.offsetWidth;

    if (window.scrollY > topOffset) {
      this.elem.style.position = 'fixed';
      this.elem.style.left = `${hasFreePlaceForIcon ? leftOffset : resizeLeftOffset}px`;
      this.elem.style.top = '50px';
      this.elem.style.zIndex = '900';
    } else {
      this.elem.removeAttribute("style");

    }
  }
}
