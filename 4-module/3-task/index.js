function highlight(table) {
  const rows = table.querySelectorAll("tbody > tr");

  for (let row of rows) {
    const [_, ageCell, genderCell, statusCell] = row.cells;

    if (statusCell.dataset.available) {
      row.classList.add(
        statusCell.dataset.available === "true" ? "available" : "unavailable"
      );
    } else {
      row.hidden = true;
    }

    row.classList.add(genderCell.innerText === "m" ? "male" : "female");

    if (+ageCell.innerText < 18) {
      row.style.textDecoration = "line-through";
    }
  }
}
