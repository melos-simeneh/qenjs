const qenjs = require("./src/index");

// const currentEthiopianDate = qenjs();
// console.log(currentEthiopianDate.toString());

// const date1 = qenjs(new Date());
// console.log(date1.toString("YYYY-MM-dd HH:mm:ss.SSS A"));

// const date2 = qenjs(new Date());
// console.log(date2.toString("YYYY-MM-dd HH:mm:ss.SSS A"));

// const date3 = qenjs("1903,05-16", { isNight: true });
// const date4 = qenjs("1903-05-16 2", { isNight: true });
// const date3 = qenjs("1903,05-16");
// console.log(date3.toString());
// console.log(date4.toGregorianDate().toString());
const date6 = qenjs.fromGregorianDate("2025-01-24").toString();
console.log(date6);
const date7 = qenjs.fromGregorianDate(new Date(2025, 0, 24));
const date8 = date7.toGregorianDate();
console.log(qenjs.format(date7), qenjs.format(date8));
// console.log(new Date("2025-01-24").getHours());

// const date4 = qenjs.mata(1903, 5, 16);
// console.log(date4.toString("DDDD, MMMM dd YYYY HH:mm:ss A"));

// const date5 = qenjs(1903, 5, 16);
// console.log(date5.toString("DDDD, MMMM dd YYYY HH:mm:ss A"));
// console.log(date1.toString("DDDD, MMMM dd, YYYY HH:mm:ss A"));
// console.log(date1.toGregorianDate(), date1.toGregorianDate().toString());

// const now = new Date("2017-01-01");

// console.log(now.toString());

// const EthNow = EthDateTime.now();
// console.log(EthNow.toDateString());
// console.log(EthNow.toTimeString());
