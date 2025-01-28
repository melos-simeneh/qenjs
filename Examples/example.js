const qenjs = require("../src/index");
// console.log(currentEthiopianDate.toString("DDDD, MMMM dd YYYY"));
// console.log(currentEthiopianDate.add(2, "hours"));
// console.log(
//   currentEthiopianDate
//     .subtract(-2, "hours")
//     .toString("DDDD, MMMM dd YYYY HH:mm:ss A")
// );
// console.log(qenjs.diff(currentEthiopianDate, currentEthiopianDate));
// const date3 = qenjs("1903,05-16", { isNight: true });
// const date3 = qenjs("1903,05-16");

// console.log(date3.toString());
// console.log(date4.toGregorianDate().toString());
// const date6 = qenjs.fromGregorianDate("2025-01-24");
// console.log(date6);
// const date10 = qenjs.toEthiopianDate("2025-01-24");
// console.log(date10);
// const date7 = qenjs.fromGregorianDate(new Date(2025, 0, 24));
// const date8 = date7.toGregorianDate();
// console.log(qenjs.format(date7), qenjs.format(date8));
// console.log(new Date("2025-01-24").getHours());

// const date4 = qenjs.mata(1903, 5, 16);
// console.log(date4.toString("DDDD, MMMM dd YYYY HH:mm:ss A"));

// const date5 = qenjs(1903, 5, 16);
// console.log(date5.toString("DDDD, MMMM dd YYYY HH:mm:ss A"));
// console.log(date1.toString("DDDD, MMMM dd, YYYY HH:mm:ss A"));
// console.log(date1.toGregorianDate(), date1.toGregorianDate().toString());

// const now = new Date("2017-01-01");

// console.log(now.toString());

const date = qenjs.gregorian(2025, 1, 1);
console.log(date.toString("DDDD, MMMM dd YYYY HH:mm:ss A"));

const date2 = qenjs.gregorian();

console.log(date2.isAfter(date));
console.log(date2.isSame(date));
console.log(date2.isBefore(date));
console.log(date2.$d, date.$d);

const date3 = qenjs.gregorian(2025, 1, 1);
console.log(date3.isAfter(date));
console.log(date3.isSame(date));
console.log(date3.isBefore(date));
console.log(date3.$d, date.$d);

console.log(date3.endOfDay().format("YYYY-MM-dd HH:mm:ss A"));
console.log(date3.startOfDay().format("YYYY-MM-dd HH:mm:ss A"));

const eDate = qenjs();
const eDate2 = qenjs("2017-05-19");

console.log(qenjs.diff(eDate, eDate2));
console.log(qenjs.diff(new Date(), new Date(2025, 0, 29)));
console.log(
  qenjs.diff(
    new Date("2025-01-28T08:45:37.507Z"),
    new Date("2025-01-27T04:00:00.000Z")
  )
);
console.log(eDate.$d, eDate2.$d);
console.log(eDate.format("YYYY-MM-dd HH:mm:ss A", "en"), eDate2.$d);
