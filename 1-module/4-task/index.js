function checkSpam(str) {
  const spamValues = ["1xBet", "XXX"];
  let res = false;

  spamValues.forEach((spamItem) => {
    if (str.toLowerCase().includes(spamItem.toLowerCase())) {
      res = true;
    }
  });

  return res;
}
