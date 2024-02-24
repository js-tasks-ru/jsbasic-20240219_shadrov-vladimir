function camelize(str) {
  const wordsArray = str
    .split("-")
    .map((word, index) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1)
    );
  return wordsArray.join("");
}
