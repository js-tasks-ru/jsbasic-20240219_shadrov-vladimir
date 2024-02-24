function showSalary(users, age) {
  let res = "";
  const filtredUsers = users.filter((user) => user.age <= age);

  filtredUsers.forEach((user, index, array) => {
    const { name, balance } = user;
    res += `${name}, ${balance}`;
    if (index < array.length - 1) {
      res += "\n";
    }
  });
  return res;
}
