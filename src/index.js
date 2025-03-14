const EthiopianDate = require("./EthiopianDate");
const GregorianDate = require("./GregorianDate");
const GregorianDateFormatter = require("./GregorianDateFormatter");
const utils = require("./utils");
const g_utils = require("./gregorian-utils");

class InvalidDateError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidDateError";
  }
}

function validateIsNight(isNight) {
  if (isNight && typeof isNight !== "boolean") {
    throw new InvalidDateError("IsNight must be boolean");
  }
}

function createEthiopianDateFromArgs(args, isNight) {
  const [arg] = args;

  if (typeof arg === "string") {
    if (arg.trim().length === 0) {
      throw new InvalidDateError(
        "Invalid Date: Could not parse the date string."
      );
    }
    const ethDate = utils.parseEthiopianDateStringAndReturnDate(arg);
    return new EthiopianDate(ethDate, isNight);
  }

  if (arg instanceof Date) {
    throw new InvalidDateError("Invalid Date: Date object is not allowed.");
  }

  if (arg != null && typeof arg === "object") {
    if (!arg.year) {
      throw new InvalidDateError("Invalid Date: Year is mandatory.");
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

function qenjs(...args) {
  try {
    const { isNight } =
      args.length > 1 && typeof args[args.length - 1] === "object"
        ? args.pop()
        : {};

    validateIsNight(isNight);

    if (args.length === 0) {
      return new EthiopianDate(new Date(), isNight);
    }

    return createEthiopianDateFromArgs(args, isNight);
  } catch (error) {
    return error.message;
  }
}

qenjs.mata = function (...args) {
  return qenjs(...args, { isNight: true });
};

qenjs.fromGregorianDate = function (input = new Date()) {
  try {
    let date;
    if (typeof input === "string") {
      if (!input.includes("T") && !input.includes(" ")) {
        input += "T00:00:00.000Z";
      }
      date = new Date(input);

    } else if (input instanceof Date) {
      date = input;
    } else {
      throw new InvalidDateError("Invalid Date");
    }

    if (isNaN(date)) throw new InvalidDateError("Invalid Date");

    return new EthiopianDate(date);
  } catch (error) {
    return error.message;
  }
};

qenjs.toGregorianDate = function (ethiopianDate) {
  try {
    if (ethiopianDate instanceof EthiopianDate) {
      return ethiopianDate.toGregorianDate();
    }
    throw new InvalidDateError("Input must be an instance of EthiopianDate.");
  } catch (error) {
    return error.message;
  }
};

qenjs.toEthiopianDate = function (input) {
  return qenjs.fromGregorianDate(input);
};

qenjs.format = function (date, formatString) {
  try {
    if (date instanceof EthiopianDate || date instanceof GregorianDate) {
      return date.toString(formatString);
    }
    if (date instanceof Date) {
      return GregorianDateFormatter.format(date, formatString);
    }
    throw new InvalidDateError("Invalid Date");
  } catch (error) {
    return error.message;
  }
};

qenjs.diff = function (date1, date2, unit = "") {
  try {
    if (date1 instanceof EthiopianDate && date2 instanceof EthiopianDate) {
      return EthiopianDate.diff(date1, date2, unit);
    }
    if (
      (date1 instanceof Date || date1 instanceof GregorianDate) &&
      (date2 instanceof Date || date2 instanceof GregorianDate)
    ) {
      return GregorianDate.difference(date1, date2, unit);
    }
    throw new InvalidDateError("Invalid Date");
  } catch (error) {
    return error.message;
  }
};

qenjs.diffString = function (
  date1,
  date2,
  { unit = "millisecond", useLatin = false } = {}
) {
  try {
    if (date1 instanceof EthiopianDate && date2 instanceof EthiopianDate) {
      return EthiopianDate.diffString(date1, date2, { unit, useLatin });
    }
    if (
      (date1 instanceof Date || date1 instanceof GregorianDate) &&
      (date2 instanceof Date || date2 instanceof GregorianDate)
    ) {
      return GregorianDate.diffString(date1, date2, unit);
    }
    throw new InvalidDateError("Invalid Date");
  } catch (error) {
    return error.message;
  }
};

qenjs.gregorian = function (...args) {
  try {
    if (args.length === 0) {
      return new GregorianDate(new Date());
    }

    const [arg] = args;

    if (arg instanceof Date) {
      if (isNaN(arg)) {
        throw new InvalidDateError("Invalid Date");
      }
      return new GregorianDate(arg);
    }

    if (typeof arg === "string") {
      if (arg.trim().length === 0) {
        throw new InvalidDateError("Invalid Date");
      }
      let date = new Date(arg);
      if (isNaN(date)) date = g_utils.parseDateString(arg);
      return new GregorianDate(date);
    }

    if (arg != null && typeof arg === "object") {
      if (!arg.year) {
        throw new InvalidDateError("Invalid Date");
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
  } catch (error) {
    return error.message;
  }
};

qenjs.EthiopianDate = EthiopianDate;
qenjs.GregorianDate = GregorianDate;

qenjs.isEthiopianDate = (date) => date instanceof EthiopianDate;
qenjs.isGregorianDate = (date) =>
  date instanceof GregorianDate || date instanceof Date;

module.exports = qenjs;
