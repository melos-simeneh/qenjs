const constant = require("./gregorian-constants");

// Helper to generate an invalid date object
const generateInvalidDate = () => ({
  year: NaN,
  month: NaN,
  day: NaN,
  hours: NaN,
  minutes: NaN,
  seconds: NaN,
  milliseconds: NaN,
});

// Helper to check if a value is within a range
const isValidInRange = (value, min, max) =>
  !isNaN(value) && value >= min && value <= max;

// Helper to check if a year is a leap year
const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

// Helper to get the number of days in a month for a given year
const getDaysInMonth = (month, year) => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) return 29; // February in a leap year
  return daysInMonth[month - 1]; // Months are 1-indexed
};

// Helper to parse a time string (e.g., "12:34:56.789")
const parseTime = (timeString) => {
  const [time, millisecondPart] = timeString.trim().split(".");
  const [
    hours,
    minutes = constant.INITIAL_MINUTE,
    seconds = constant.INITIAL_SECOND,
  ] = time.split(":").map(Number);

  if (
    !isValidInRange(hours, constant.MIN_HOUR, constant.MAX_HOUR) ||
    !isValidInRange(minutes, constant.MIN_MINUTE, constant.MAX_MINUTE) ||
    !isValidInRange(seconds, constant.MIN_SECOND, constant.MAX_SECOND)
  ) {
    return generateInvalidDate();
  }

  const milliseconds = millisecondPart
    ? parseInt(millisecondPart, 10)
    : constant.INITIAL_MILLISECOND;

  if (
    !isValidInRange(
      milliseconds,
      constant.MIN_MILLISECOND,
      constant.MAX_MILLISECOND
    )
  ) {
    return generateInvalidDate();
  }

  return { hours, minutes, seconds, milliseconds };
};

// Main function to parse a date string (e.g., "2023-10-05 12:34:56.789")
const parseDateString = (dateString) => {
  const normalizedString = dateString.trim().replace(/\s+/g, " ");
  const [datePart, timePartString] = normalizedString.split(/[ T]/);
  const timePart = timePartString.trim().replace(/Z$/, "");

  const [year, month = constant.INITIAL_MONTH, day = constant.INITIAL_DAY] =
    datePart
      .replace(/[-/.,]/g, "-")
      .split("-")
      .map(Number);

  if (
    !isValidInRange(year, constant.MIN_YEAR, constant.MAX_YEAR) ||
    !isValidInRange(month, constant.MIN_MONTH, constant.MAX_MONTH) ||
    !isValidInRange(day, constant.MIN_DAY, getDaysInMonth(month, year))
  ) {
    return generateInvalidDate();
  }

  const time = timePart
    ? parseTime(timePart)
    : {
        hours: constant.INITIAL_HOUR,
        minutes: constant.INITIAL_MINUTE,
        seconds: constant.INITIAL_SECOND,
        milliseconds: constant.INITIAL_MILLISECOND,
      };

  if (isNaN(time.hours)) {
    return generateInvalidDate();
  }

  return { year, month, day, ...time };
};

// Main function to validate a date object
const validateDate = (date) => {
  const {
    year,
    month = constant.INITIAL_MONTH,
    day = constant.INITIAL_DAY,
    hours = constant.INITIAL_HOUR,
    minutes = constant.INITIAL_MINUTE,
    seconds = constant.INITIAL_SECOND,
    milliseconds = constant.INITIAL_MILLISECOND,
  } = date;

  const monthZero = month >= 1 && month <= 12 ? month - 1 : month;

  const validations = [
    { value: year, min: constant.MIN_YEAR, max: constant.MAX_YEAR },
    { value: monthZero, min: constant.MIN_MONTH, max: constant.MAX_MONTH },
    { value: day, min: constant.MIN_DAY, max: getDaysInMonth(month, year) },
    { value: hours, min: constant.MIN_HOUR, max: constant.MAX_HOUR },
    { value: minutes, min: constant.MIN_MINUTE, max: constant.MAX_MINUTE },
    { value: seconds, min: constant.MIN_SECOND, max: constant.MAX_SECOND },
    {
      value: milliseconds,
      min: constant.MIN_MILLISECOND,
      max: constant.MAX_MILLISECOND,
    },
  ];

  for (const { value, min, max } of validations) {
    if (!isValidInRange(value, min, max)) return generateInvalidDate();
  }

  return {
    year,
    month: monthZero,
    day,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
};

// Export the main functions
module.exports = {
  parseDateString,
  validateDate,
};
