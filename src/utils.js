const constant = require("./constants");

const generateInvalidDate = () => ({
  year: NaN,
  month: NaN,
  day: NaN,
  hours: NaN,
  minutes: NaN,
  seconds: NaN,
  milliseconds: NaN,
});

const isValidInRange = (value, min, max) =>
  !isNaN(value) && value >= min && value <= max;

const parseTime = (timeString) => {
  const [time, millisecondPart] = timeString.trim().split(".");
  const [
    hours,
    minutes = constant.INITIAL_MINUTE,
    seconds = constant.INITIAL_SECOND,
  ] = time.split(":").map(Number);

  // Use constants for min/max values of hours, minutes, and seconds
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

exports.parseEthiopianDateStringAndReturnDate = (dateString) => {
  const normalizedString = dateString.trim().replace(/\s+/g, " ");
  const [datePart, timePart] = normalizedString.split(" ");

  const [year, month = constant.INITIAL_MONTH, day = constant.INITIAL_DAY] =
    datePart
      .replace(/[-/.,]/g, "-")
      .split("-")
      .map(Number);

  if (
    !isValidInRange(year, constant.MIN_YEAR, constant.MAX_YEAR) ||
    !isValidInRange(month, constant.MIN_MONTH, constant.MAX_MONTH) ||
    !isValidInRange(day, constant.MIN_DAY, constant.MAX_DAY)
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

exports.validateEthiopianDate = (date) => {
  const {
    year,
    month = constant.INITIAL_MONTH,
    day = constant.INITIAL_DAY,
    hours = constant.INITIAL_HOUR,
    minutes = constant.INITIAL_MINUTE,
    seconds = constant.INITIAL_SECOND,
    milliseconds = constant.INITIAL_MILLISECOND,
  } = date;

  const validations = [
    { value: year, min: constant.MIN_YEAR, max: constant.MAX_YEAR },
    { value: month, min: constant.MIN_MONTH, max: constant.MAX_MONTH },
    { value: day, min: constant.MIN_DAY, max: constant.MAX_DAY },
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

  return { year, month, day, hours, minutes, seconds, milliseconds };
};
