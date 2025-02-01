const isLeapYear = (year) => year % 4 === 3;

const daysInYear = (year) => {
  return isLeapYear(year) ? 366 : 365;
};

const daysFromStartOfYear = (year, month, day) => {
  let days = (month - 1) * 30;
  if (month == 13 && (day == 5 || day == 6)) {
    days += isLeapYear(year) && day == 6 ? 6 : 5;
  } else days += day;
  return days;
};

const totalDateParts = (ethDate1, ethDate2) => {
  let { $y: year1, $M: month1, $D: day1 } = ethDate1;
  let { $y: year2, $M: month2, $D: day2 } = ethDate2;

  let totalDays = 0;
  let totalMonths = 0;
  let totalYears = 0;

  if (year1 === year2) {
    totalYears = 0;
    totalMonths = month2 - month1;
    totalDays =
      daysFromStartOfYear(year2, month2, day2) -
      daysFromStartOfYear(year1, month1, day1);
  } else {
    for (let year = year1 + 1; year < year2; year++) {
      totalDays += daysInYear(year);
      totalYears++;
      totalMonths += 13;
    }

    totalDays += daysInYear(year1) - daysFromStartOfYear(year1, month1, day1);
    totalMonths += 13 - (month1 - 1);

    totalDays += daysFromStartOfYear(year2, month2, day2);
    totalMonths += month2 - 1;
  }
  return { totalYears, totalMonths, totalDays };
};

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;

const totalTimeParts = (ethDate1, ethDate2, totalDays) => {
  let { $H: hour1, $m: minute1, $s: second1, $ms: millisecond1 } = ethDate1;
  let { $H: hour2, $m: minute2, $s: second2, $ms: millisecond2 } = ethDate2;

  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;
  const totalMilliseconds = totalSeconds * 1000;

  const diffMilliseconds = Math.abs(millisecond2 - millisecond1);
  const diffS = Math.abs(second2 - second1);
  const diffM = Math.abs(minute2 - minute1);
  const diffH = Math.abs(hour2 - hour1);

  const totalDiffMillSecond =
    diffMilliseconds +
    diffS * MS_PER_SECOND +
    diffM * MS_PER_MINUTE +
    diffH * MS_PER_HOUR +
    totalMilliseconds;

  const hours = Math.floor(totalDiffMillSecond / MS_PER_HOUR);
  const minutes = Math.floor(totalDiffMillSecond / MS_PER_MINUTE);
  const seconds = Math.floor(totalDiffMillSecond / MS_PER_SECOND);
  const milliseconds = totalDiffMillSecond;
  return { hours, minutes, seconds, milliseconds };
};
const difference = (ethDate1, ethDate2, unit) => {
  const { totalMonths, totalYears, totalDays } = totalDateParts(
    ethDate1,
    ethDate2
  );

  const { hours, minutes, seconds, milliseconds } = totalTimeParts(
    ethDate1,
    ethDate2,
    totalDays
  );

  switch (unit) {
    case "years":
      return totalYears;
    case "months":
      return totalMonths;
    case "days":
      return totalDays;

    case "hours":
      return hours;

    case "minutes":
      return minutes;

    case "seconds":
      return seconds;

    case "all":
      return allDiff(ethDate1, ethDate2, milliseconds, totalDays, totalMonths);

    default:
      return milliseconds;
  }
};

const allDiff = (
  ethDate1,
  ethDate2,
  totalMilliseconds,
  totalDays,
  totalMonths
) => {
  const years = yearDiff(ethDate1, ethDate2);
  const months = monthDiff(ethDate1, ethDate2) % 13;
  const days = remainingDays(ethDate1, ethDate2, months);
  const hours = Math.floor((totalMilliseconds % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((totalMilliseconds % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor(
    (totalMilliseconds % MS_PER_MINUTE) / MS_PER_SECOND
  );
  const milliseconds = totalMilliseconds % MS_PER_SECOND;
  const weeks = Math.floor(totalMilliseconds / MS_PER_WEEK); //  totalDays/7
  const remainingDaysAfterWeeks = totalDays - weeks * 7; // totalDays%7

  return {
    full: {
      years,
      months,
      days: days,
      hours,
      minutes,
      seconds,
      milliseconds,
    },
    byMonths: {
      months: totalMonths,
      days: days,
      hours,
      minutes,
      seconds,
      milliseconds,
    },
    byWeeks: {
      weeks,
      days: remainingDaysAfterWeeks,
      hours,
      minutes,
      seconds,
      milliseconds,
    },
  };
};

function remainingDays(ethDate1, ethDate2, monthsToAdd) {
  const { $y: year1, $M: month1, $D: day1 } = ethDate1;
  const { $y: year2, $M: month2, $D: day2 } = ethDate2;

  const totalDays2 = daysFromStartOfYear(year2, month2, day2);

  let totalMonths = month1 - 1 + monthsToAdd;
  let adjustedYear = year1 + Math.floor(totalMonths / 13);
  let adjustedMonth = (totalMonths % 13) + 1;

  const adjustedTotalDays = daysFromStartOfYear(
    adjustedYear,
    adjustedMonth,
    day1
  );
  const remainingDays = totalDays2 - adjustedTotalDays;

  return remainingDays;
}

function yearDiff(ethDate1, ethDate2) {
  let { $y: year1, $M: month1, $D: day1 } = ethDate1;
  let { $y: year2, $M: month2, $D: day2 } = ethDate2;
  if (year1 > year2) {
    [year1, year2] = [year2, year1];
    [month1, month2] = [month2, month1];
    [day1, day2] = [day2, day1];
  }

  let years = year2 - year1;

  if (month2 < month1 || (month2 === month1 && day2 < day1)) {
    years--;
  }

  return years;
}
function monthDiff(ethDate1, ethDate2) {
  let { $y: year1, $M: month1, $D: day1 } = ethDate1;
  let { $y: year2, $M: month2, $D: day2 } = ethDate2;

  if (
    year1 > year2 ||
    (year1 === year2 && month1 > month2) ||
    (year1 === year2 && month1 === month2 && day1 > day2)
  ) {
    [year1, year2] = [year2, year1];
    [month1, month2] = [month2, month1];
    [day1, day2] = [day2, day1];
  }

  let months = (year2 - year1) * 13 + (month2 - month1);

  if (day2 < day1) {
    months--;
  }

  return months;
}

function toRelativeTime(
  date1,
  date2,
  withoutSuffix = false,
  isAmharic = false
) {
  const result = difference(date1, date2, "all");

  if (typeof result === "string") return result;

  const { years, months, days, hours, minutes, seconds, milliseconds } =
    result.full;
  const isFuture = date2 > date1;

  // If no time difference
  if (
    years === 0 &&
    months === 0 &&
    days === 0 &&
    hours === 0 &&
    minutes === 0 &&
    seconds === 0 &&
    milliseconds === 0
  ) {
    return isAmharic ? "አሁን" : "Ahun";
  }

  // Find the first non-zero absolute value and return its relative time
  const timeUnits = [
    { value: Math.abs(years), unit: "year" },
    { value: Math.abs(months), unit: "month" },
    { value: Math.abs(days), unit: "day" },
    { value: Math.abs(hours), unit: "hour" },
    { value: Math.abs(minutes), unit: "minute" },
    { value: Math.abs(seconds), unit: "second" },
    { value: Math.abs(milliseconds), unit: "millisecond" },
  ];

  for (const { value, unit } of timeUnits) {
    if (value > 0) {
      return formatTime(isFuture, value, unit, withoutSuffix);
    }
  }
}

const englishAmharicTimeUnits = {
  year: "amet",
  month: "wer",
  day: "ken",
  hour: "seat",
  minute: "dekika",
  second: "sekond",
  millisecond: "milisekond",
};

const englishAmharicPrefixes = {
  future: "ke",
  futureSuffix: "behuala",
  past: "ke",
  pastSuffix: "befit",
};

const amharicTimeUnits = {
  year: "ዓመት",
  month: "ወር",
  day: "ቀን",
  hour: "ሰዓት",
  minute: "ደቂቃ",
  second: "ሴኮንድ",
  millisecond: "ሚሊሴኮንድ",
};

const amharicPrefixes = {
  future: "ከ",
  futureSuffix: "በኋላ",
  past: "ከ",
  pastSuffix: "ፊት",
};

function formatTime(isFuture, value, unit, withoutSuffix, isAmharic = false) {
  const timeUnits = isAmharic ? amharicTimeUnits : englishAmharicTimeUnits;
  const prefixes = isAmharic ? amharicPrefixes : englishAmharicPrefixes;

  const timeUnit = timeUnits[unit] || unit;

  const timeString = `${value} ${timeUnit}`;

  if (withoutSuffix) {
    return timeString;
  }

  if (isFuture) {
    return `${prefixes.future} ${timeString} ${prefixes.futureSuffix}`;
  } else {
    return `${prefixes.past} ${timeString} ${prefixes.pastSuffix}`;
  }
}

const formatTimeParts = (
  { years, months, weeks, days, hours, minutes, seconds, milliseconds },
  isAmharic = true
) => {
  const timeUnits = isAmharic ? amharicTimeUnits : englishAmharicTimeUnits;

  const timeValues = [
    { value: years, unit: timeUnits.year },
    { value: months, unit: timeUnits.month },
    { value: weeks, unit: timeUnits.week },
    { value: days, unit: timeUnits.day },
    { value: hours, unit: timeUnits.hour },
    { value: minutes, unit: timeUnits.minute },
    { value: seconds, unit: timeUnits.second },
    { value: milliseconds, unit: timeUnits.millisecond },
  ];

  const timeParts = timeValues
    .filter(({ value }) => value > 0)
    .map(({ value, unit }) => `${value} ${unit}`);

  return timeParts.length
    ? timeParts.join(", ")
    : isAmharic
    ? "ተመሳሳይ ቀን"
    : "temesasay qen";
};

module.exports = { difference, formatTimeParts, toRelativeTime };
