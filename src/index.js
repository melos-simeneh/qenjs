const EthiopianDate = require("./EthiopianDate");
const GregorianDateFormatter = require("./GregorianDateFormatter");
const utils = require("./utils");

function qenjs(...args) {
  const { isNight } =
    args.length && typeof args[args.length - 1] === "object" ? args.pop() : {};

  if (isNight && typeof isNight !== "boolean") {
    return "IsNight must be boolean";
  }

  if (args.length === 0) {
    return new EthiopianDate(new Date(), isNight);
  }

  const [arg] = args;

  if (typeof arg === "string") {
    if (arg.trim().length === 0) {
      return "Invalid Date: Could not parse the date string.";
    }
    const ethDate = utils.parseEthiopianDateStringAndReturnDate(arg);
    return new EthiopianDate(ethDate, isNight);
  }

  if (arg instanceof Date) {
    return "Invalid Date: Date object is not allowed.";
  }

  if (arg != null && typeof arg === "object") {
    if (!arg.year) {
      return "Invalid Date: Year is mandatory.";
    }
    const ethDate = utils.validateEthiopianDate(arg);
    return new EthiopianDate(ethDate, isNight);
  }

  const [year, month, day, hours, minutes, seconds, milliseconds] = args;
  const ethDate = utils.validateEthiopianDate({
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    milliseconds,
  });
  return new EthiopianDate(ethDate, isNight);
}
qenjs.mata = function (...args) {
  return qenjs(...args, { isNight: true });
};
qenjs.fromGregorianDate = function (input) {
  if (typeof input === "string") {
    const date = new Date(input);
    const isoString = date.toISOString();
    if (isoString.endsWith("T00:00:00.000Z")) {
      date.setHours(0);
    }

    if (isNaN(date)) return "Invalid Date";
    return new EthiopianDate(date);
  }

  if (input instanceof Date) {
    return new EthiopianDate(input);
  }

  return "Invalid Date";
};

qenjs.toGregorianDate = function (ethiopianDate) {
  if (ethiopianDate instanceof EthiopianDate) {
    return ethiopianDate.toGregorianDate();
  }

  return "Input must be an instance of EthiopianDate.";
};

qenjs.format = function (date, formatString) {
  if (date instanceof EthiopianDate) return date.toString(formatString);
  if (date instanceof Date)
    return GregorianDateFormatter.format(date, formatString);
  return "Invalid Date";
};

module.exports = qenjs;
