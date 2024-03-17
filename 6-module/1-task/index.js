/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this.rows = rows;
    this.elem = this.createElem(this.createElemTemplate());
    this.createEventListeners();
  }
  createElem(template) {
    const elem = document.createElement("div");
    elem.innerHTML = template;
    return elem.firstElementChild;
  }

  createElemTemplate() {
    return `
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Возраст</th>
            <th>Зарплата</th>
            <th>Город</th>
            <th></th>
          </tr>
        </thead>
        <tbody data-id="my-table">
          ${this.createTableBody()}
        </tbody>
      </table>
    `;
  }
  createTableBody() {
    return this.rows
      .map((row) => `<tr>${this.createTableRow(row)}</tr>`)
      .join("");
  }

  createTableRow(rowData) {
    let rowTemplate = Object.values(rowData)
      .map((dataItem) => `<td>${dataItem}</td>`)
      .join("");

    rowTemplate += "<td><button>X</button></td>";

    return rowTemplate;
  }

  createEventListeners() {
    const buttonElements = this.elem.querySelectorAll("button");

    for (const button of buttonElements) {
      button.addEventListener("click", this.deleteBtnClickHandler);
    }
  }

  deleteBtnClickHandler = (event) => {
    const buttonElement = event.target.closest("button");
    buttonElement.removeEventListener("click", this.deleteBtnClickHandler);
    buttonElement.closest("tr").remove();
  };
}
