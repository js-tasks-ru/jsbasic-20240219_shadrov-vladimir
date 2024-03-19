import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  static isModalOpen = false;

  constructor() {
    this.element = createElement(this.createModalTemplate());
    this.titleElement = this.element.querySelector('.modal__title');
    this.bodyElement = this.element.querySelector('.modal__body');
    this.closeBtnElement = this.element.querySelector('.modal__close');

    this.createListeners();
  }

  createModalTemplate() {
    return (`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>

            <h3 class="modal__title"></h3>
          </div>

          <div class="modal__body"></div>
        </div>
      </div>
    `);
  }

  setTitle(title) {
    this.titleElement.textContent = title;
  }

  setBody(body) {
    this.bodyElement.append(body);
  }

  createListeners() {
    this.closeBtnElement.addEventListener('click', this.close);
    document.addEventListener('keydown', this.escapeKeydownHandler);
  }

  destroyEventListeners() {
    this.closeBtnElement.removeEventListener('click', this.close);
    document.removeEventListener('keydown', this.escapeKeydownHandler);
  }

  open() {
    if (Modal.isModalOpen) {
      return;
    }

    Modal.isModalOpen = true;
    document.body.append(this.element);
    document.body.classList.add('is-modal-open');
  }

  escapeKeydownHandler = (event) => {
    if (event.code !== 'Escape') {
      return;
    }
    this.destroy();
  };

  close = () => {
    this.destroy();
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    Modal.isModalOpen = false;
    document.body.classList.remove('is-modal-open');
    this.destroyEventListeners();
    this.remove();
  }
}
