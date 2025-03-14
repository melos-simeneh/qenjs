const qenjs = require("../src/index");
console.log(currentEthiopianDate.toString("DDDD, MMMM dd YYYY"));
console.log(currentEthiopianDate.add(2, "hours"));
console.log(
  currentEthiopianDate
    .subtract(-2, "hours")
    .toString("DDDD, MMMM dd YYYY HH:mm:ss A")
);
console.log(qenjs.diff(currentEthiopianDate, currentEthiopianDate));
const date3 = qenjs("1903,05-16", { isNight: true });

console.log(date3.toString());
console.log(date4.toGregorianDate().toString());
const date6 = qenjs.fromGregorianDate("2025-01-24");
console.log(date6);
const date10 = qenjs.toEthiopianDate("2025-01-24");
console.log(date10);
const date7 = qenjs.fromGregorianDate(new Date(2025, 0, 24));
const date8 = date7.toGregorianDate();
console.log(qenjs.format(date7), qenjs.format(date8));
console.log(new Date("2025-01-24").getHours());

const date4 = qenjs.mata(1903, 5, 16);
console.log(date4.toString("DDDD, MMMM dd YYYY HH:mm:ss A"));

const date5 = qenjs(1903, 5, 16);
console.log(date5.toString("DDDD, MMMM dd YYYY HH:mm:ss A"));

const now = new Date("2017-01-01");

console.log(now.toString());
