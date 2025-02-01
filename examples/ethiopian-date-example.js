// Importing the qenjs module which includes EthiopianDate functionality
const qenjs = require("../src"); // Make sure your path is correct

// Example 1: Create Ethiopian Date from current date
const ethiopianDate1 = qenjs();
console.log("Ethiopian Date (Current Date):", ethiopianDate1.toString()); // Outputs current Ethiopian date

// Example 2: Create Ethiopian Date from a specific date string
const ethiopianDate2 = qenjs("2017-01-29"); // Create Ethiopian date from Ethiopian Date string
console.log(
  "Ethiopian Date from String (2017-01-29):",
  ethiopianDate2.format("DDDD, MMMM dd YYYY") //ረቡዕ, መስከረም 29 2017
);

// Example 3: Create Ethiopian Date from an object with year, month, and day
const ethiopianDate3 = qenjs({ year: 2017, month: 4, day: 15 });
console.log(
  "Ethiopian Date from Object (2017-04-15):",
  ethiopianDate3.toString("DDDD, MMMM dd YYYY", "eng") // Maksegno, Tahsas 15 2017
);

// Example 4: Create Ethiopian Date with specific time (year, month, day, hours, minutes, etc.)
const ethiopianDate4 = qenjs(2017, 4, 15, 10, 30, 0, 0); // Date: 2017-04-15 10:30:00
console.log(
  "Ethiopian Date with Time (2017-04-15 14:30):",
  ethiopianDate4.toString("MMMM dd, YYYY HH:mm:ss A") //ታኅሣሥ 15, 2017 10:30:00 ከሰዓት
);

// Example 5: Create Ethiopian Date for "night" (6 PM onwards)
const ethiopianNightDate = qenjs("2017-01-29", { isNight: true }); // Specify night time
console.log(
  "Ethiopian Night Date (6 PM onwards):",
  ethiopianNightDate.toString("dd/MM/YYYY HH:mm:ss A") //29/01/2017 01:00:00 ምሽት
);

// Example 6: Convert Ethiopian Date to Gregorian Date
const gregorianDate = qenjs.toGregorianDate(ethiopianDate3); // Convert to Gregorian Date
console.log("Gregorian Date from Ethiopian Date:", gregorianDate.toISOString()); //2024-12-24T04:00:00.000Z

// Example 7: Format Ethiopian Date in a custom format
console.log(
  "Formatted Ethiopian Date:",
  qenjs.format(ethiopianDate3, "dd/MM/YYYY")
);

// Example 8: Format Ethiopian Date in a different language (e.g., Amharic) default is amharic
console.log(
  "Formatted Ethiopian Date (Amharic):",
  ethiopianDate3.format("MMMM dd, YYYY", "amh") // ታኅሣሥ 15, 2017  for lang="en" Tahsas 15, 2017
);

// Example 9: Get relative time from the current date (e.g., "5 years ago")
console.log("Relative Time (from now):", ethiopianDate3.fromNow());

// Example 10: Calculate the difference between two Ethiopian Dates
const date1 = qenjs(2017, 1, 1);
const date2 = qenjs(2017, 13, 5);

console.log(
  "Difference between 2017-04-15 and 2020-04-15:",
  qenjs.diff(date1, date2)
);

console.log(
  "Difference String between 2017-04-15 and 2017-04-15:",
  qenjs.diffString(date1, date2)
);

// console.log("Relative Time from today to 2017-04-15:", date1.fromNow());
// console.log("Relative Time from 2017-04-15 to today:", date1.toNow());
// console.log("Relative Time from 2017-04-15 to 2017-04-15:", date1.from(date1));
// console.log("Relative Time between 2017-04-15 and today:", date1.from(date2));
// console.log("Relative Time between 2017-04-15 and today:", date1.to(date1));
// console.log("Relative Time between 2017-04-15 and today:", date1.to(date2));

// console.log(date1.to(date2));
// console.log(dayjs("2025-01-01").to("2025-01-27"));
const de1 = qenjs.gregorian("2025-02-01");
const de2 = qenjs.gregorian("2025-03-30");

// Example 11: Calculate the difference in a specific unit (e.g., days)
console.log(
  "Difference between 2017-04-15 and 2020-04-15 in days:",
  qenjs.diff(date1, date2, "days")
);

// Example 12: Use `isBefore` to compare two Ethiopian Dates
const ethDate1 = qenjs(2025, 1, 29); // Ethiopian Date: 2025-01-29
const ethDate2 = qenjs(2024, 1, 29); // Ethiopian Date: 2024-01-29
console.log("Is Date 1 before Date 2?", ethDate1.isBefore(ethDate2)); // Should print false

// Example 13: Use `isLeapYear` to check if the Ethiopian year is a leap year
console.log("Is the year of Date 1 a leap year?", ethDate1.isLeapYear()); // Should print true or false based on the year

// Example 14: Adding days to an Ethiopian date
const newDate = ethDate1.addDays(10); // Adds 10 days
console.log("Date after adding 10 days:", newDate.toString());

// Example 15: Subtracting days from an Ethiopian date
const previousDate = ethDate1.subtractDays(5); // Subtracts 5 days
console.log("Date after subtracting 5 days:", previousDate.toString());

// Example 16: Comparing dates (isAfter)
console.log("Is Date 1 after Date 2?", ethDate1.isAfter(ethDate2)); // Should print true

// Example 17: Get the relative time (e.g., 'in X days' or 'X days ago')
console.log("Relative time for Date 1:", ethDate1.fromNow());

// Example 18: Convert EthiopianDate to a string with specific format
console.log("Formatted Date 1:", ethDate1.toString("dd/MM/YYYY")); // Custom format example

// Example 19: Convert Gregorian Date to Ethiopian Date (using `fromGregorianDate`)
const ethDateFromGregorian = qenjs.fromGregorianDate(new Date()); // Current Gregorian date
console.log("Ethiopian Date from Gregorian:", ethDateFromGregorian.toString());

// Example 20: Use `qenjs.mata` for night-specific Ethiopian dates
const ethDateNight = qenjs.mata(2025, 1, 29); // This creates a night-specific date
console.log("Night-specific Ethiopian Date:", ethDateNight.toString());
