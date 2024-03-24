import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.modal = null;
    this.productElements = null;
    this.countElement = null;
    this.productPriceElement = null;
    this.totalPriceElement = null;
    this.subminBtnElement = null;
    this.formElement = null;
    this.modalBody = null;
    this.changeAction = ''; // minus | plus

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product || product === null) {
      return;
    }

    let productIndex = this.findProductIndex(product.id);

    if (productIndex > -1) {
      this.cartItems[productIndex].count++;
    } else {
      this.cartItems.push({ product, count: 1 });
    }

    productIndex = this.findProductIndex(product.id);

    this.onProductUpdate(this.cartItems[productIndex]);
  }

  updateProductCount(productId, amount) {
    const productIndex = this.findProductIndex(productId);

    if (productIndex === -1) {
      return;
    }

    this.cartItems[productIndex].count += amount;

    if (this.cartItems[productIndex].count === 0) {
      this.cartItems.splice(productIndex, 1);
    } else {
      this.onProductUpdate(this.cartItems[productIndex]);
    }
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((acc, item) => acc + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((acc, item) => acc + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus" data-action="minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus" data-action="plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  createSuccessElement() {
    return createElement(`
    <div class="modal__body-inner">
      <p>
        Order successful! Your order is being cooked :) <br>
        We’ll notify you about delivery time shortly.<br>
        <img src="/assets/images/delivery.gif">
      </p>
    </div>
    `);
  }

  renderModal() {
    this.modal = new Modal();
    document.body.append(this.modal.element); // Без этой строки не проходят тесты "открытие модального окна с корзиной"
    // this.modal.open(); - Хотя эта строка делает то же самое
    // Все дело в статическом свойстве isModalOpen, но без него, когда окно открыто, в случае нажатия на пробел или enter
    // в дом дерево добавляется дополнительный элемент модального окна
    this.modal.setTitle('Your order');
    this.modal.setBody(this.createCartBodyElement());

    this.productElements = document.querySelectorAll('.cart-product');
    this.subminBtnElement = document.querySelector('.cart-buttons__button.btn-group__button.button');
    this.formElement = document.querySelector('.cart-form');
    this.modalBody = this.modal.bodyElement;
    this.createCartListeners();
  }

  createCartListeners() {
    this.productElements.forEach(product => product.addEventListener('click', this.productElementClickHandler));
    this.formElement.addEventListener('submit', this.onSubmit);
  }

  destroyCartListeners() {
    this.productElements.forEach(product => product.removeEventListener('click', this.productElementClickHandler));
    this.formElement.removeEventListener('submit', this.onSubmit);
  }

  productElementClickHandler = (event) => {
    const product = event.target.closest('.cart-product');

    if (!product) {
      return;
    }

    const cartItemIndex = this.findProductIndex(product.dataset.productId);
    const cartItem = this.cartItems[cartItemIndex];
    this.countElement = product.querySelector('.cart-counter__count');
    this.productPriceElement = product.querySelector('.cart-product__price');
    this.totalPriceElement = document.querySelector('.cart-buttons__info-price');

    if (event.target.closest('[data-action]')) {
      this.changeAction = event.target.closest('[data-action]').dataset.action;

      if (this.changeAction === 'plus') {
        this.updateProductCount(product.dataset.productId, 1);
      } else {
        this.updateProductCount(product.dataset.productId, -1);
      }
    }

    if (cartItem.count === 0) {
      this.productElements[cartItemIndex].remove();
      this.productElements = document.querySelectorAll('.cart-product');
    }

    if (this.isEmpty()) {
      this.destroyCartListeners();
      this.modal.close();

    }

    this.onProductUpdate(cartItem);
  };

  createCartBodyElement() {
    const bodyContainer = document.createElement('div');

    if (this.cartItems.length) {
      for (const cartItem of this.cartItems) {
        bodyContainer.append(this.renderProduct(cartItem.product, cartItem.count));
      }
      bodyContainer.append(this.renderOrderForm());
    } else {
      bodyContainer.append(this.createSuccessElement());
    }
    return bodyContainer;
  }

  onProductUpdate(cartItem) {
    if (this.countElement && this.productPriceElement && this.totalPriceElement) {
      this.countElement.textContent = cartItem.count;
      this.productPriceElement.textContent = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      this.totalPriceElement.textContent = `€${this.getTotalPrice().toFixed(2)}`;
    }

    this.cartIcon.update(this);
  }

  onSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(this.formElement);
      this.subminBtnElement.classList.add('is-loading');
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        this.subminBtnElement.classList.remove('is-loading');
        this.cartItems = [];
        this.modal.setTitle('Success!');
        this.modalBody.innerHTML = '';
        this.modal.setBody(this.createCartBodyElement());
        this.cartIcon.update(this);
        this.destroyCartListeners();
      }
    } catch (error) {
      console.error(error);
    }
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }

  findProductIndex(productId) {
    return this.cartItems.findIndex(cartItem => cartItem.product.id === productId);
  }
}

