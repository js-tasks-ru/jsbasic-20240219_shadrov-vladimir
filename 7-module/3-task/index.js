import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.clusters = this.steps - 1;
    this.value = value > this.clusters ? this.clusters : value;
    this.elem = createElement(this.createElemTemplate());
    this.stepActiveClass = 'slider__step-active';
    this.stepsElement = this.elem.querySelector('.slider__steps');
    this.thumbElement = this.elem.querySelector('.slider__thumb');
    this.progressElement = this.elem.querySelector('.slider__progress');
    this.valueElement = this.elem.querySelector('.slider__value');

    this.setActiveStep();
    this.createEventListeners();
  }

  createElemTemplate() {
    return (`
        <div class="slider">
          <div class="slider__thumb" style="left: ${this.setProgress()}%;">
            <span class="slider__value">${this.value}</span>
          </div>
          <div class="slider__progress" style="width: ${this.setProgress()}%;"></div>
          <div class="slider__steps">
            ${this.createStepTemplate()}
          </div>
        </div>
    `);
  }

  createStepTemplate() {
    let steps = '';

    for (let step = 0; step < this.steps; step++) {
      steps += '<span></span>';
    }

    return steps;
  }

  createEventListeners() {
    this.elem.addEventListener('click', this.elemClickHandler);
  }

  elemClickHandler = (event) => {
    const elemLeft = this.elem.getBoundingClientRect().left;
    const clickPosition = event.clientX - elemLeft;
    this.value = Math.round(clickPosition / this.elem.offsetWidth * this.clusters);
    this.updateView();

    this.elem.dispatchEvent(new CustomEvent('slider-change', { detail: this.value, bubbles: true }));
  };

  updateView() {
    this.thumbElement.style.left = `${this.setProgress()}%`;
    this.progressElement.style.width = `${this.setProgress()}%`;
    this.valueElement.textContent = this.value;
    this.setActiveStep();
  }

  setProgress() {
    if (this.value === 0) {
      return 0;
    }

    return this.value / this.clusters * 100;
  }

  setActiveStep() {
    for (const step of this.stepsElement.children) {
      step.classList.remove(this.stepActiveClass);
    }
    this.stepsElement.children[this.value].classList.add(this.stepActiveClass);
  }
}
