const GregorianDateFormatter = require("./GregorianDateFormatter");

class GregorianDate {
  $d;
  $y;
  $M;
  $D;
  $W;
  $H;
  $m;
  $s;
  $ms;
  $DWM;
  $DWY;

  constructor(input) {
    if (input instanceof Date) {
      this.$d = input;
      this.$y = input.getFullYear();
      this.$M = input.getMonth();
      this.$D = input.getDate();
      this.$W = input.getDay();
      this.$H = input.getHours();
      this.$m = input.getMinutes();
      this.$s = input.getSeconds();
      this.$ms = input.getMilliseconds();
      this.$DWM = this.getWeekOfMonth();
      this.$DWY = this.getWeekOfYear();
    } else {
      this.$y = input.year;
      this.$M = input.month;
      this.$D = input.day;
      this.$H = input.hours;
      this.$m = input.minutes;
      this.$s = input.seconds;
      this.$ms = input.milliseconds;
      this.$d = this.getGregorianDateTime();
      this.$W = this.$d.getDay();
      this.$DWM = this.getWeekOfMonth();
      this.$DWY = this.getWeekOfYear();
    }
  }

  get Year() {
    return this.$y;
  }

  get Month() {
    return this.$M;
  }

  get Day() {
    return this.$D;
  }

  get Hours() {
    return this.$H;
  }

  get Minutes() {
    return this.$m;
  }

  get Seconds() {
    return this.$s;
  }

  get Milliseconds() {
    return this.$ms;
  }

  get DayOfWeek() {
    return this.$W; // 0 to 6 (Sunday to Saturday)
  }

  get DateTime() {
    return new Date(this.$d);
  }

  get getDayWeekInMonth() {
    return this.getWeekOfMonth();
  }

  get getDayWeekInYear() {
    return this.getWeekOfYear();
  }

  getWeekOfMonth() {
    return Math.ceil(this.$D / 7);
  }

  getWeekOfYear() {
    const startDate = new Date(this.$y, 0, 1);
    const diff = this.$d - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.ceil((days + 1) / 7);
  }

  getGregorianDateTime() {
    const datetime = new Date(this.$y, this.$M, this.$D);
    datetime.setHours(this.$H, this.$m, this.$s, this.$ms);
    return datetime;
  }

  static difference(date1, date2, unit = "") {
    const MS_PER_SECOND = 1000;
    const MS_PER_MINUTE = MS_PER_SECOND * 60;
    const MS_PER_HOUR = MS_PER_MINUTE * 60;
    const MS_PER_DAY = MS_PER_HOUR * 24;
    const MS_PER_MONTH = MS_PER_DAY * 30.44;
    const MS_PER_YEAR = MS_PER_DAY * 365.25; // Account for leap years

    const timestamp1 =
      date1 instanceof GregorianDate
        ? date1.$d.getTime()
        : new Date(date1).getTime();
    const timestamp2 =
      date2 instanceof GregorianDate
        ? date2.$d.getTime()
        : new Date(date2).getTime();

    const diffInMs = Math.abs(timestamp1 - timestamp2);

    const normalizedUnit = unit.toLowerCase().replace(/s$/, "");

    switch (normalizedUnit) {
      case "millisecond":
        return diffInMs % MS_PER_SECOND;
      case "second":
        return Math.floor(diffInMs / MS_PER_SECOND) % 60;
      case "minute":
        return Math.floor(diffInMs / MS_PER_MINUTE) % 60;
      case "hour":
        return Math.floor(diffInMs / MS_PER_HOUR) % 24;
      case "day":
        return Math.floor(diffInMs / MS_PER_DAY);
      case "month":
        return Math.floor(diffInMs / MS_PER_MONTH);
      case "year":
        return Math.floor(diffInMs / MS_PER_YEAR);
      default:
        const years = Math.floor(diffInMs / MS_PER_YEAR);
        const remainingMsAfterYears = diffInMs % MS_PER_YEAR;
        const months = Math.floor(remainingMsAfterYears / MS_PER_MONTH);
        const remainingMsAfterMonths = remainingMsAfterYears % MS_PER_MONTH;
        const days = Math.floor(remainingMsAfterMonths / MS_PER_DAY);
        const remainingMsAfterDays = remainingMsAfterMonths % MS_PER_DAY;
        const hours = Math.floor(remainingMsAfterDays / MS_PER_HOUR);
        const remainingMsAfterHours = remainingMsAfterDays % MS_PER_HOUR;
        const minutes = Math.floor(remainingMsAfterHours / MS_PER_MINUTE);
        const remainingMsAfterMinutes = remainingMsAfterHours % MS_PER_MINUTE;
        const seconds = Math.floor(remainingMsAfterMinutes / MS_PER_SECOND);
        const milliseconds = remainingMsAfterMinutes % MS_PER_SECOND;

        return {
          years,
          months,
          days,
          hours,
          minutes,
          seconds,
          milliseconds,
        };
    }
  }

  static differenceString(date1, date2) {
    const { years, months, days, hours, minutes, seconds } =
      GregorianDate.difference(date1, date2);
    return `${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }

  diff(date, unit = "") {
    return GregorianDate.difference(this.$d, date, unit);
  }
  // Add / Subtract Years, Months, Days
  addYears(years) {
    const date = {
      year: this.$y + years,
      month: this.$M,
      day: this.$D,
      hours: this.$H,
      minutes: this.$m,
      seconds: this.$s,
      milliseconds: this.$ms,
    };

    return new GregorianDate(date);
  }

  addMonths(months) {
    let newMonth = this.$M + months;
    let newYear = this.$y;

    while (newMonth > 12) {
      newYear += Math.floor(newMonth / 12);
      newMonth = newMonth % 12;
    }

    const date = {
      year: newYear,
      month: newMonth,
      day: this.$D,
      hours: this.$H,
      minutes: this.$m,
      seconds: this.$s,
      milliseconds: this.$ms,
    };

    return new GregorianDate(date);
  }

  addDays(days) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setDate(gregorianDate.getDate() + days);
    return new GregorianDate(gregorianDate);
  }

  addHours(hours) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setHours(gregorianDate.getHours() + hours);
    return new GregorianDate(gregorianDate);
  }

  addMinutes(minutes) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setMinutes(gregorianDate.getMinutes() + minutes);
    return new GregorianDate(gregorianDate);
  }

  addSeconds(seconds) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setSeconds(gregorianDate.getSeconds() + seconds);
    return new GregorianDate(gregorianDate);
  }

  addMilliseconds(milliseconds) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setMilliseconds(
      gregorianDate.getMilliseconds() + milliseconds
    );
    return new GregorianDate(gregorianDate);
  }

  add(amount, unit) {
    if (!Number.isInteger(amount)) {
      return "Invalid amount";
    }

    const normalizedUnit = unit?.toLowerCase().replace(/s$/, "");

    const unitActions = {
      day: this.addDays,
      month: this.addMonths,
      year: this.addYears,
      hour: this.addHours,
      minute: this.addMinutes,
      second: this.addSeconds,
      millisecond: this.addMilliseconds,
    };

    const action = unitActions[normalizedUnit];

    if (action) {
      return action.call(this, amount);
    } else {
      return "Invalid Unit";
    }
  }

  subtractYears(years) {
    return this.addYears(-years);
  }

  subtractMonths(months) {
    return this.addMonths(-months);
  }

  subtractDays(days) {
    return this.addDays(-days);
  }

  subtractHours(hours) {
    return this.addHours(-hours);
  }

  subtractMinutes(minutes) {
    return this.addMinutes(-minutes);
  }

  subtractSeconds(seconds) {
    return this.addSeconds(-seconds);
  }

  subtract(amount, unit) {
    return this.add(-amount, unit);
  }

  // Start of the day (00:00:00.000)
  startOfDay() {
    const startOfDayDate = new Date(this.$d);
    startOfDayDate.setHours(0, 0, 0, 0);
    return new GregorianDate(startOfDayDate);
  }

  // End of the day (23:59:59.999)
  endOfDay() {
    const endOfDayDate = new Date(this.$d);
    endOfDayDate.setHours(23, 59, 59, 999);
    return new GregorianDate(endOfDayDate);
  }

  _getTimestamp(date) {
    if (date instanceof Date) {
      return date.getTime();
    } else if (date instanceof GregorianDate) {
      return date.$d.getTime();
    } else {
      return null; // Indicates invalid date
    }
  }
  // Comparison Methods
  isBefore(date) {
    const compareTimestamp = this._getTimestamp(date);
    if (compareTimestamp === null) return false;
    return this.$d.getTime() < compareTimestamp;
  }

  isAfter(date) {
    const compareTimestamp = this._getTimestamp(date);
    if (compareTimestamp === null) return false;
    return this.$d.getTime() > compareTimestamp;
  }

  isSame(date) {
    const compareTimestamp = this._getTimestamp(date);
    if (compareTimestamp === null) return false;
    return this.$d.getTime() === compareTimestamp;
  }

  // Format Date (to simple string format)
  toString(format = "dd/MM/YYYY") {
    return GregorianDateFormatter.format(this, format);
  }
  format(template) {
    return GregorianDateFormatter.format(this, template);
  }
}

module.exports = GregorianDate;
