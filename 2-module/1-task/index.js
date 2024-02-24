function sumSalary(salaries) {
  const numsArray = Object.values(salaries).filter(
    (item) => typeof item === "number" && !isNaN(item) && isFinite(item)
  );
  return numsArray.reduce((acc, num) => acc + num, 0);
}
