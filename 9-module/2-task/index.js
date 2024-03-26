import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
    this.carouselContainer = document.querySelector('[data-carousel-holder]');
    this.ribbonMenuContainer = document.querySelector('[data-ribbon-holder]');
    this.stepSliderContainer = document.querySelector('[data-slider-holder]');
    this.cartIconContainer = document.querySelector('[data-cart-icon-holder]');
    this.productListContainer = document.querySelector('[data-products-grid-holder]');
    this.nutsCheckbox = document.getElementById('nuts-checkbox');
    this.vegetarianCheckbox = document.getElementById('vegeterian-checkbox');


    this.carouser = new Carousel(slides);
    this.ribbonMenu = new RibbonMenu(categories);
    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);

    this.createEventListeners();
  }

  async render() {
    this.carouselContainer.append(this.carouser.elem);
    this.ribbonMenuContainer.append(this.ribbonMenu.elem);
    this.stepSliderContainer.append(this.stepSlider.elem);
    this.cartIconContainer.append(this.cartIcon.elem);

    try {
      const response = await fetch('products.json');

      if (response.ok) {
        this.products = await response.json();
        this.productGrid = new ProductsGrid(this.products);

        this.productListContainer.innerHTML = '';
        this.productListContainer.append(this.productGrid.elem);
        this.productGrid.updateFilter({
          maxSpiciness: this.stepSlider.value,
          noNuts: this.nutsCheckbox.checked,
          vegeterianOnly: this.vegetarianCheckbox.checked
        });
      }
    } catch (error) {
      console.error(error);
    }

    return new Promise((resolve) => { resolve(); });
  }

  createEventListeners() {
    this.nutsCheckbox.addEventListener('change', (event) => this.productGrid.updateFilter({ noNuts: event.target.checked }));
    this.vegetarianCheckbox.addEventListener('change', (event) => this.productGrid.updateFilter({ vegeterianOnly: event.target.checked }));
    document.addEventListener('slider-change', (event) => this.productGrid.updateFilter({ maxSpiciness: event.detail }));
    document.addEventListener('ribbon-select', (event) => this.productGrid.updateFilter({ category: event.detail }));
    document.body.addEventListener('product-add', (event) => {
      const productToAdd = this.products.find((product) => product.id === event.detail);

      if (!productToAdd) {
        return;
      }

      this.cart.addProduct(productToAdd);
    });
  }

}
