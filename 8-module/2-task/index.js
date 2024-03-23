import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {
      noNuts: false,
      vegeterianOnly: false,
      maxSpiciness: 4,
      category: ''
    };
    this.elem = createElement(this.createElemTemplate());
    this.listContainerElement = this.elem.querySelector('.products-grid__inner');
    this.renderList(this.products);
  }
  createElemTemplate() {
    return (`
      <div class="products-grid">
        <div class="products-grid__inner"></div>
      </div>
    `);
  }

  renderList(products) {
    for (const product of products) {
      const productElem = new ProductCard(product);
      this.listContainerElement.append(productElem.elem);
    }
  }

  updateFilter(data) {
    this.updateFiltersObject(data);

    const filtredProducts = this.products.filter(product => {
      if (this.filters.noNuts && product.nuts) {
        return false;
      }

      if (this.filters.vegeterianOnly && !product.vegeterian) {
        return false;
      }

      if (this.filters.maxSpiciness && product.spiciness > this.filters.maxSpiciness) {
        return false;
      }

      if (this.filters.category && product.category !== this.filters.category) {
        return false;
      }

      return true;
    });

    this.listContainerElement.innerHTML = '';
    this.renderList(filtredProducts);

  }

  updateFiltersObject(filterData) {
    for (const key in filterData) {
      this.filters[key] = filterData[key];
    }
  }
}
