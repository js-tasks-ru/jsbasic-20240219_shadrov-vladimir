function getMinMax(str) {
  const numsArray = str.split(" ").filter((item) => !isNaN(item));
  return {
    min: Math.min(...numsArray),
    max: Math.max(...numsArray),
  };
}
