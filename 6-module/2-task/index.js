import createElement from "../../assets/lib/create-element.js";

export default class ProductCard {
  constructor({
    name = "",
    price = 0,
    category = "",
    image = "",
    id = ""
  } = {}) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.image = image;
    this.id = id;
    this.elem = createElement(this.createElemTemplate());
    this.addButtonElement = this.elem.querySelector(".card__button");
    this.createEventListeners();
  }
  createElemTemplate() {
    return `
      <div class="card">
        <div class="card__top">
          <img src="/assets/images/products/${this.image}" class="card__image" alt="product">
          <span class="card__price">€${this.price.toFixed(2)}</span>
        </div>
        <div class="card__body">
          <div class="card__title">${this.name}</div>
          <button type="button" class="card__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `;
  }

  createEventListeners() {
    this.addButtonElement.addEventListener(
      "click",
      this.cardElementClickHandler
    );
  }

  cardElementClickHandler = (event) => {
    const custormEvent = new CustomEvent("product-add", {
      detail: this.id,
      bubbles: true,
    });
    document.body.dispatchEvent(custormEvent);
  };
}
