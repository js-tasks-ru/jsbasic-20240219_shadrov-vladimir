function toggleText() {
  const btn = document.querySelector(".toggle-text-button");
  const text = document.querySelector("#text");
  let isHidden = false;

  btn.addEventListener("click", () => {
    isHidden = !isHidden;
    text.hidden = isHidden;
  });
}
