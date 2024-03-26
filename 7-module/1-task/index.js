import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.cssClassNames = {
      menuLeftBtn: 'ribbon__arrow_left',
      menuRightBtn: 'ribbon__arrow_right',
      menuBtnVisible: 'ribbon__arrow_visible',
      menuItemActive: 'ribbon__item_active'
    };

    this.elem = createElement(this.createElemTemplate());
    this.menuInnerElement = this.elem.querySelector('.ribbon__inner');
    this.ribbonArrowRight = this.elem.querySelector('.ribbon__arrow_right');
    this.ribbonArrowLeft = this.elem.querySelector('.ribbon__arrow_left');


    this.createEventListeners();
  }
  createElemTemplate() {
    return (`
      <div class="ribbon">
        ${this.createButtonTemplate(this.cssClassNames.menuLeftBtn)}
        <nav class="ribbon__inner">
          ${this.categories.map((category, index) => this.createMenuItemTemplate(category, index)).join('')}
        </nav>
        ${this.createButtonTemplate(this.cssClassNames.menuRightBtn, this.cssClassNames.menuBtnVisible)}
      </div>
    `);
  }

  createButtonTemplate(className, activeClassName = '') {
    return (`
        <button class="ribbon__arrow ${className} ${activeClassName}">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
    `);
  }

  createMenuItemTemplate(data, index) {
    return `<a href="#" class="ribbon__item ${index === 0 ? this.cssClassNames.menuItemActive : ''}" data-id="${data.id}">${data.name}</a>`;
  }

  createEventListeners() {
    this.menuInnerElement.addEventListener('click', this.menuClickHandler);
    this.ribbonArrowRight.addEventListener('click', this.innerElementClickHandler);
    this.ribbonArrowLeft.addEventListener('click', this.innerElementClickHandler);
    this.menuInnerElement.addEventListener('scrollend', this.updateBtnVisibility);

  }

  menuClickHandler = (event) => {
    event.preventDefault();
    const menuItem = event.target.closest('.ribbon__item');

    if (!menuItem) {
      return;
    }

    for (const child of this.menuInnerElement.children) {
      child.classList.remove(this.cssClassNames.menuItemActive);
    }

    menuItem.classList.add(this.cssClassNames.menuItemActive);
    this.elem.dispatchEvent(new CustomEvent('ribbon-select', { detail: menuItem.dataset.id, bubbles: true }));
  };

  innerElementClickHandler = (event) => {
    const arrowElement = event.target.closest('.ribbon__arrow');

    if (!arrowElement) {
      return;
    }

    this.scrollInnerElement(arrowElement);
    // this.updateBtnVisibility();
  };

  scrollInnerElement(element) {
    const scrollStep = 350;
    const scrollDirection = element.classList.contains('ribbon__arrow_right') ? 'right' : 'left';
    const xCoords = scrollDirection === 'right' ? scrollStep : -scrollStep;

    this.menuInnerElement.scrollBy(xCoords, 0);

  }

  updateBtnVisibility = () => {
    const { scrollLeft, scrollWidth, clientWidth } = this.menuInnerElement;
    const right = scrollWidth - clientWidth - scrollLeft;

    this.ribbonArrowLeft.classList.toggle(this.cssClassNames.menuBtnVisible, scrollLeft > 0);
    this.ribbonArrowRight.classList.toggle(this.cssClassNames.menuBtnVisible, right > 1);
  };
}
