class GregorianDateFormatter {
  _pad(number, length = 2) {
    return !isNaN(number) ? String(number).padStart(length, "0") : number;
  }

  static format(date, formatString = "dd/MM/YYYY HH:mm:ss.SSS A") {
    // Create an instance of the class
    const instance = new GregorianDateFormatter();

    date = date instanceof Date ? date : new Date(date);

    const tokens = {
      YYYY: date.getFullYear(),
      YY: date.getFullYear() % 100,
      MMMM: instance._getMonthName(date),
      MMM: instance._getMonthName(date, true),
      MM: instance._pad(date.getMonth() + 1),
      HH: instance._pad(date.getHours()),
      H: date.getHours(),
      hh: instance._pad(date.getHours() % 12 || 12),
      h: instance._pad(date.getHours() % 12 || 12),
      DDDD: instance._getDayName(date),
      DDD: instance._getDayName(date, true),
      dd: instance._pad(date.getDate()),
      d: date.getDate(),
      mm: instance._pad(date.getMinutes()),
      ss: instance._pad(date.getSeconds()),
      SSS: instance._pad(date.getMilliseconds(), 3),
      A: date.getHours() >= 12 ? "PM" : "AM",
      a: date.getHours() >= 12 ? "pm" : "am",
    };

    return formatString.replace(
      /YYYY|YY|MMMM|MMM|MM|DDDD|DDD|HH|H|mm|hh|h|dd|d|ss|SSS|A|a/g,
      (match) => tokens[match]
    );
  }

  // Get full day name (e.g., "Monday")
  _getDayName(date, abbr = false) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[date.getDay()];
    return abbr ? day.slice(0, 3) : day;
  }

  // Get full month name (e.g., "January")
  _getMonthName(date, abbr = false) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    return abbr ? month.slice(0, 3) : month;
  }
}

module.exports = GregorianDateFormatter;
