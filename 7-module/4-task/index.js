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
    this.shiftX = 0;

    this.setActiveStep();
    this.createEventListeners();
    this.thumbElement.ondragstart = () => false;
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
    this.thumbElement.addEventListener('pointerdown', this.thumbPointerdownHandler);
  }

  elemClickHandler = (event) => {
    const elemLeft = this.elem.getBoundingClientRect().left;
    const left = event.clientX - elemLeft;
    this.setValue(left);
    this.updateView();
    this.createCustomEvent();
  };

  thumbPointerdownHandler = (event) => {
    // const { left, right } = this.thumbElement.getBoundingClientRect();
    // this.shiftX = left + (right - left) / 2 - event.clientX;

    this.elem.classList.add('slider_dragging');
    document.addEventListener('pointermove', this.thumbPointerMoveHandler);
    document.addEventListener('pointerup', this.documentPointerUpHandler);
  };

  thumbPointerMoveHandler = (event) => {
    const left = event.clientX - this.elem.getBoundingClientRect().left; // + this.shiftX;
    let percentX = left / this.elem.offsetWidth * 100;


    if (percentX > 100) {
      percentX = 100;
    }

    if (percentX < 0) {
      percentX = 0;
    }


    this.thumbElement.style.left = `${percentX}%`;
    this.progressElement.style.width = `${percentX}%`;
    this.valueElement.textContent = this.value;

    this.setValue(left);
    this.setActiveStep();
  };

  documentPointerUpHandler = () => {
    document.removeEventListener('pointermove', this.thumbPointerMoveHandler);
    document.removeEventListener('pointerup', this.documentPointerUpHandler);
    this.elem.classList.remove('slider_dragging');
    this.updateView();
    this.createCustomEvent();
  };

  createCustomEvent() {
    this.elem.dispatchEvent(new CustomEvent('slider-change', { detail: this.value, bubbles: true }));
  }

  setValue(leftValue) {
    let left = leftValue;

    if (left < 0) {
      left = 0;
    }

    if (left > this.elem.offsetWidth) {
      left = this.elem.offsetWidth;
    }

    if (this.elem.offsetWidth) {
      this.value = Math.round(left / this.elem.offsetWidth * this.clusters);
    }
  }

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
