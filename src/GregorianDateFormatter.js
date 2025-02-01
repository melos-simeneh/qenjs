class GregorianDateFormatter {
  static DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  static MONTH_NAMES = [
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

  isGregorianDateObject(obj) {
    if (!obj || !(obj.$d instanceof Date)) {
      return false;
    }
    const { $y, $M, $D, $isGregorianDateObject } = obj;

    return (
      typeof $y === "number" &&
      typeof $M === "number" &&
      typeof $D === "number" &&
      typeof $isGregorianDateObject === "boolean" &&
      $isGregorianDateObject
    );
  }

  // Format the input date according to the format string
  static format(input, formatString = "YYYY-MM-ddTHH:mm:ssZ") {
    const instance = new GregorianDateFormatter();
    const isGregorianDate = instance.isGregorianDateObject(input);
    const date = isGregorianDate ? input : new Date(input);
    if (
      (!(date instanceof Date) && !isGregorianDate) ||
      (isGregorianDate && Object.values(date).some(isNaN))
    ) {
      return "Invalid Date";
    }

    // Generate tokens and replace placeholders
    const tokens = instance._generateTokens(date, isGregorianDate);
    return formatString.replace(
      /YYYY|YY|MMMM|MMM|MM|DDDD|DDD|HH|H|mm|hh|h|dd|d|ss|SSS|A|a|Z/g,
      (match) => tokens[match] || match
    );
  }

  // Format time zone offset
  formatTimeZoneOffset(offset) {
    const sign = offset > 0 ? "-" : "+";
    const hours = String(Math.abs(Math.floor(offset / 60))).padStart(2, "0");
    const minutes = String(Math.abs(offset % 60)).padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
  }

  // Generate tokens for formatting
  _generateTokens(date, isGregorianDate) {
    const year = isGregorianDate ? date.$y : date.getFullYear();
    const month = isGregorianDate ? date.$M : date.getMonth();
    const day = isGregorianDate ? date.$D : date.getDate();
    const hours = isGregorianDate ? date.$H : date.getHours();
    const minutes = isGregorianDate ? date.$m : date.getMinutes();
    const seconds = isGregorianDate ? date.$s : date.getSeconds();
    const milliseconds = isGregorianDate ? date.$ms : date.getMilliseconds();
    const dayOfWeek = isGregorianDate ? date.$W : date.getDay();

    const pad = (num, length = 2) =>
      !isNaN(num) ? String(num).padStart(length, "0") : num;

    const isPM = hours >= 12;
    const ampm = isPM ? "PM" : "AM";
    const ampmLower = ampm.toLowerCase();
    const twelveHour = hours % 12 || 12;

    return {
      YYYY: year,
      YY: pad(year % 100),
      MMMM: this._getMonthName(month),
      MMM: this._getMonthName(month, true),
      MM: pad(month + 1),
      M: month + 1,
      HH: pad(hours),
      H: hours,
      hh: pad(twelveHour),
      h: twelveHour,
      DDDD: this._getDayName(dayOfWeek),
      DDD: this._getDayName(dayOfWeek, true),
      dd: pad(day),
      d: day,
      mm: pad(minutes),
      ss: pad(seconds),
      SSS: pad(milliseconds, 3),
      A: ampm,
      a: ampmLower,
      Z: this.formatTimeZoneOffset(
        isGregorianDate ? date.$d.getTimezoneOffset() : date.getTimezoneOffset()
      ),
    };
  }

  // Get day name
  _getDayName(day, abbr = false) {
    const dayName = GregorianDateFormatter.DAY_NAMES[day];
    return abbr ? dayName.slice(0, 3) : dayName;
  }

  // Get month name
  _getMonthName(month, abbr = false) {
    const monthName = GregorianDateFormatter.MONTH_NAMES[month];
    return abbr ? monthName.slice(0, 3) : monthName;
  }
}

module.exports = GregorianDateFormatter;
