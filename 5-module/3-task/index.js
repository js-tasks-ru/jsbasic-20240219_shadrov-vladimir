function initCarousel() {
  const slidesRow = document.querySelector(".carousel__inner");
  const btnNext = document.querySelector(".carousel__arrow_right");
  const btnPrev = document.querySelector(".carousel__arrow_left");
  let slideWidth = 0;
  let currentSlide = 0;
  let direction = "";

  updateBtnVisibility();

  btnNext.addEventListener("click", () => {
    direction = "next";
    switchSlide();
  });
  btnPrev.addEventListener("click", () => {
    direction = "prev";
    switchSlide();
  });

  function switchSlide() {
    slideWidth = slidesRow.children[currentSlide].getBoundingClientRect().width;

    if (direction === "next") {
      currentSlide += 1;
    } else {
      currentSlide -= 1;
    }

    slidesRow.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
    updateBtnVisibility();
  }

  function updateBtnVisibility() {
    switch (currentSlide) {
      case 0:
        btnPrev.style.display = "none";
        break;
      case slidesRow.children.length - 1:
        btnNext.style.display = "none";
        break;
      default:
        btnNext.style.display = "flex";
        btnPrev.style.display = "flex";
    }
  }
}
