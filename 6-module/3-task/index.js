import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.elem = createElement(this.createElementTemplate());
    this.slidesRowElement = this.elem.querySelector('.carousel__inner');
    this.btnNextElement = this.elem.querySelector(".carousel__arrow_right");
    this.btnPrevElement = this.elem.querySelector(".carousel__arrow_left");
    this.currentSlide = 0;

    this.createEventListeners();
    this.updateBtnVisibility();
  }

  createElementTemplate() {
    return `
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right" data-target="switcher" data-direction="next">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left" data-target="switcher" data-direction="prev">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
        <div class="carousel__inner">${this.createSlidesTemplate()}</div>
      </div>
    `;
  }

  createSlidesTemplate() {
    return this.slides.map(({ name, price, image, id }) => {
      return `
          <div class="carousel__slide" data-id="${id}">
            <img src="/assets/images/carousel/${image}" class="carousel__img" alt="slide">
            <div class="carousel__caption">
              <span class="carousel__price">€${price.toFixed(2)}</span>
              <div class="carousel__title">${name}</div>
              <button type="button" class="carousel__button">
                <img src="/assets/images/icons/plus-icon.svg" alt="icon">
              </button>
            </div>
          </div>
      `;
    }).join('');
  }

  createEventListeners() {
    this.btnNextElement.addEventListener('click', this.btnControlClickHandler);
    this.btnPrevElement.addEventListener('click', this.btnControlClickHandler);
    const addBtnElements = this.elem.querySelectorAll('.carousel__button');

    for (const button of addBtnElements) {
      button.addEventListener('click', this.addBtnClickHandler);
    }
  }

  btnControlClickHandler = (event) => {
    const direction = event.target.closest('[data-target="switcher"]').dataset.direction;

    if (!direction) {
      return;
    }

    if (direction === 'next') {
      this.currentSlide += 1;
    } else {
      this.currentSlide -= 1;
    }

    const slideWidth = -this.slidesRowElement.children[this.currentSlide].offsetWidth;
    this.slidesRowElement.style.transform = `translateX(${slideWidth * this.currentSlide}px)`;
    this.updateBtnVisibility();
  };

  addBtnClickHandler = (event) => {
    const id = event.target.closest('.carousel__slide').dataset.id;
    const customEvent = new CustomEvent('product-add', { detail: id, bubbles: true });
    this.elem.dispatchEvent(customEvent);
  };

  updateBtnVisibility() {
    const isFirstSlide = this.currentSlide === 0;
    const isLastSlide = this.currentSlide === this.slidesRowElement.children.length - 1;

    this.btnPrevElement.style.display = isFirstSlide ? 'none' : 'flex';
    this.btnNextElement.style.display = isLastSlide ? 'none' : 'flex';
  }
}
