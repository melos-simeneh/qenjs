const EthiopianDate = require("./EthiopianDate");
const GregorianDate = require("./GregorianDate");
const GregorianDateFormatter = require("./GregorianDateFormatter");
const utils = require("./utils");
const g_utils = require("./gregorian-utils");

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

qenjs.toEthiopianDate = function (input) {
  return qenjs.fromGregorianDate(input);
};
qenjs.format = function (date, formatString) {
  if (date instanceof EthiopianDate || date instanceof GregorianDate)
    return date.toString(formatString);
  if (date instanceof Date)
    return GregorianDateFormatter.format(date, formatString);
  return "Invalid Date";
};

qenjs.diff = function (date1, date2, unit = "") {
  if (date1 instanceof EthiopianDate && date2 instanceof EthiopianDate) {
    return EthiopianDate.difference(date1, date2);
  }
  if (
    (date1 instanceof Date || date1 instanceof GregorianDate) &&
    (date2 instanceof Date || date2 instanceof GregorianDate)
  ) {
    return GregorianDate.difference(date1, date2, unit);
  }
  return "Invalid Date";
};

qenjs.gregorian = function (...args) {
  if (args.length === 0) {
    return new GregorianDate(new Date());
  }

  const [arg] = args;

  if (arg instanceof Date) {
    if (isNaN(arg)) {
      return "Invalid Date";
    }
    return new GregorianDate(arg);
  }

  if (typeof arg === "string") {
    if (arg.trim().length === 0) {
      return "Invalid Date";
    }
    const date = g_utils.parseDateStringAndReturnDate(arg);
    return new GregorianDate(date);
  }

  if (arg != null && typeof arg === "object") {
    if (!arg.year) {
      return "Invalid Date";
    }
    const date = g_utils.validateDate(arg);
    return new GregorianDate(date);
  }

  const [year, month, day, hours, minutes, seconds, milliseconds] = args;
  const date = g_utils.validateDate({
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    milliseconds,
  });
  return new GregorianDate(date);
};

module.exports = qenjs;
