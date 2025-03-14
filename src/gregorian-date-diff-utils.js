const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;

function difference(d1, d2, unit = "") {
  console.log(d1, d2, unit);
  if (!(d1 instanceof Date && d2 instanceof Date) || isNaN(d1) || isNaN(d2))
    return "Invalid Date";

  if (d1 > d2) {
    [d1, d2] = [d2, d1];
  }
  const diffInMs = d2 - d1;
  const normalizedUnit = unit.toLowerCase().replace(/s$/, "");

  switch (normalizedUnit) {
    case "millisecond":
      return diffInMs;
    case "second":
      return Math.floor(diffInMs / MS_PER_SECOND);
    case "minute":
      return Math.floor(diffInMs / MS_PER_MINUTE);
    case "hour":
      return Math.floor(diffInMs / MS_PER_HOUR);
    case "day":
      return Math.floor(diffInMs / MS_PER_DAY);
    case "week":
      return Math.floor(diffInMs / MS_PER_WEEK);
    case "month":
      return monthDiff(d1, d2);
    case "year":
      return yearDiff(d1, d2);
    case "all":
      const years = yearDiff(d1, d2);
      const months = monthDiff(d1, d2) % 12;
      const days = remainingDays(d1, d2, years, months);
      const hours = Math.floor((diffInMs % MS_PER_DAY) / MS_PER_HOUR);
      const minutes = Math.floor((diffInMs % MS_PER_HOUR) / MS_PER_MINUTE);
      const seconds = Math.floor((diffInMs % MS_PER_MINUTE) / MS_PER_SECOND);
      const milliseconds = diffInMs % MS_PER_SECOND;
      const totalDays = Math.floor(diffInMs / MS_PER_DAY);
      const weeks = Math.floor(diffInMs / MS_PER_WEEK); //  totalDays/7
      const remainingDaysAfterWeeks = totalDays - weeks * 7; // totalDays%7

      const monthsTotal = monthDiff(d1, d2);
      const remainingDaysAfterMonths = getRemainingDaysAfterMonths(
        d1,
        d2,
        monthsTotal
      );
      return {
        full: {
          years,
          months,
          days,
          hours,
          minutes,
          seconds,
          milliseconds,
        },
        byMonths: {
          months: monthsTotal,
          days: remainingDaysAfterMonths,
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
    default:
      return diffInMs;
  }
}

function monthDiff(date1, date2) {
  if (date1 > date2) {
    [date1, date2] = [date2, date1];
  }

  let months = (date2.getFullYear() - date1.getFullYear()) * 12;
  months += date2.getMonth() - date1.getMonth();

  if (date2.getDate() < date1.getDate()) {
    months--;
  }

  return months;
}

function yearDiff(date1, date2) {
  if (date1 > date2) {
    [date1, date2] = [date2, date1];
  }

  let years = date2.getFullYear() - date1.getFullYear();

  if (
    date2.getMonth() < date1.getMonth() ||
    (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())
  ) {
    years--;
  }

  return years;
}
function remainingDays(date1, date2, years, months) {
  const totalMonths = years * 12 + months;
  const adjustedDate = new Date(date1);
  adjustedDate.setMonth(date1.getMonth() + totalMonths);

  const timeDiff = date2 - adjustedDate;
  console.log(timeDiff, adjustedDate, date2);
  return Math.floor(timeDiff / MS_PER_DAY);
}
function getRemainingDaysAfterMonths(date1, date2, monthsTotal) {
  const adjustedDate = new Date(date1);
  adjustedDate.setMonth(date1.getMonth() + monthsTotal);

  const timeDiff = Math.abs(date2 - adjustedDate);
  return Math.floor(timeDiff / MS_PER_DAY);
}

const formatTimeParts = ({
  years,
  months,
  weeks,
  days,
  hours,
  minutes,
  seconds,
  milliseconds,
}) => {
  const timeParts = [];

  if (years > 0) timeParts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) timeParts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (weeks > 0) timeParts.push(`${weeks} week${weeks !== 1 ? "s" : ""}`);
  if (days > 0) timeParts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) timeParts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0)
    timeParts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (seconds > 0)
    timeParts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
  if (milliseconds > 0)
    timeParts.push(
      `${milliseconds} millisecond${milliseconds !== 1 ? "s" : ""}`
    );

  return timeParts.length ? timeParts.join(", ") : "The same time";
};

function toRelativeTime(date1, date2, withoutSuffix = false) {
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
    return "The same time";
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

function formatTime(isFuture, value, unit, withoutSuffix) {
  const timeString =
    value === 1 ? `a ${unit}` : `${value} ${unit}${value !== 1 ? "s" : ""}`;
  return withoutSuffix
    ? timeString
    : isFuture
    ? `in ${timeString}`
    : `${timeString} ago`;
}

module.exports = { difference, formatTimeParts, toRelativeTime };
