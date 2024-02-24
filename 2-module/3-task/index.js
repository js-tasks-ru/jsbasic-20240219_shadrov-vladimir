let calculator = {
  num1: 0,
  num2: 0,
  read: function (a, b) {
    if (isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b)) {
      return;
    }
    this.num1 = +a;
    this.num2 = +b;
  },
  sum: function () {
    return this.num1 + this.num2;
  },
  mul: function () {
    return this.num1 * this.num2;
  },
};

// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; // делает ваш калькулятор доступным глобально
