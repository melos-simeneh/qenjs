const EthiopianDateConverter = require("./EthiopianDateConverter");
const EthiopianDateFormatter = require("./EthiopianDateFormatter");
const dateUtils = require("./eth-date-diff-util");

class EthiopianDate {
  $d;
  $y;
  $M;
  $D;
  $W;
  $N;
  $H;
  $m;
  $s;
  $ms;
  $DWM;
  $DWY;
  $isEthiopianDateObject = true;

  constructor(input, isNight = false) {
    const setToNaN = (obj) => {
      obj.$y = NaN;
      obj.$M = NaN;
      obj.$D = NaN;
      obj.$W = NaN;
      obj.$H = NaN;
      obj.$m = NaN;
      obj.$s = NaN;
      obj.$ms = NaN;
      obj.$DWM = NaN;
      obj.$DWY = NaN;
      obj.$d = new Date(NaN);
      obj.$N = NaN;
    };

    try {
      this.$N = isNight;
      if (input instanceof Date) {
        this.$d = input;
        const ethiopianDate = EthiopianDateConverter.toEthiopianDate(input);
        this.$y = ethiopianDate.year;
        this.$M = ethiopianDate.month;
        this.$D = ethiopianDate.day;
        this.$W = this.$d.getDay();
        this.$H = (input.getHours() - 6 + 12) % 12 || 12;
        this.$m = input.getMinutes();
        this.$s = input.getSeconds();
        this.$ms = input.getMilliseconds();
        this.$DWM = Math.ceil(this.$D / 8);
        this.$DWY = this.calculateDayWeekInYear();
        this.$N = this.isNight();
      } else if (
        typeof input === "object" &&
        this.#isEthiopianDateObject(input)
      ) {
        Object.assign(this, input);
      } else if (typeof input === "object" && input.year) {
        this.$y = input.year;
        this.$M = input.month;
        this.$D = input.day;
        this.$H = input.hours;
        this.$m = input.minutes;
        this.$s = input.seconds;
        this.$ms = input.milliseconds;
        this.$d = this.getGregorianDateTime();
        this.$W = this.$d.getDay();
        this.$DWM = Math.ceil(this.$D / 8);
        this.$DWY = this.calculateDayWeekInYear();
        this.$N = this.isNight();
      } else {
        throw new Error("Invalid Date");
      }

      this.validate();
    } catch (error) {
      setToNaN(this);
    }
  }
  #isEthiopianDateObject(obj) {
    return (
      typeof obj === "object" &&
      obj !== null &&
      obj.$d instanceof Date &&
      typeof obj.$y === "number" &&
      typeof obj.$M === "number" &&
      typeof obj.$D === "number" &&
      typeof obj.$isEthiopianDateObject === "boolean" &&
      obj.$isEthiopianDateObject
    );
  }

  validate() {
    if (this.$M < 1 || this.$M > 13) {
      throw new Error("Invalid month. Month must be between 1 and 13.");
    }

    const maxDays = this.$M === 13 ? (this.isLeapYear(this.$y) ? 6 : 5) : 30;
    if (this.$D < 1 || this.$D > maxDays) {
      throw new Error(
        `Invalid day. Day must be between 1 and ${maxDays} for month ${this.$M}.`
      );
    }

    if (
      this.$H < 0 ||
      this.$H > 12 ||
      this.$m < 0 ||
      this.$m > 59 ||
      this.$s < 0 ||
      this.$s > 59 ||
      this.$ms < 0 ||
      this.$ms > 999
    ) {
      throw new Error(
        "Invalid time. Hours (0-12), minutes (0-59), seconds (0-59), and milliseconds (0-999) are required."
      );
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
    return Math.ceil(this.$D / 8);
  }

  get getDayWeekInYear() {
    return calculateDayWeekInYear();
  }
  isNight() {
    const hour = this.$d.getHours();

    return hour >= 18 || hour < 6;
  }
  isLeapYear() {
    return this.$y % 4 === 3;
  }

  calculateDayWeekInYear() {
    const daysInMonth = Array(12)
      .fill(30)
      .concat(this.isLeapYear() ? 6 : 5);
    const dayOfYear =
      daysInMonth.slice(0, this.$M - 1).reduce((sum, days) => sum + days, 0) +
      this.$D;
    return Math.ceil(dayOfYear / 7);
  }
  getGregorianDateTime() {
    const datetime = EthiopianDateConverter.toGregorianDate(
      this.$y,
      this.$M,
      this.$D
    );
    const hour = this.$H + 6 + (this.$N ? 12 : 0);
    datetime.setHours(hour, this.$m, this.$s, this.$ms);
    return datetime;
  }

  // Add / Subtract Years, Months, Days
  addYears(years) {
    this.$y += years;
    this.$d = this.getGregorianDateTime();
    this.$W = this.$d.getDay();
    this.$DWY = this.calculateDayWeekInYear();
    return this;
  }

  addMonths(monthsToAdd) {
    let year = this.$y,
      month = this.$M,
      day = this.$D;
    const monthsInYear = 13;
    let newMonth = month + monthsToAdd;
    let newYear = year;

    while (newMonth > monthsInYear) {
      newMonth -= monthsInYear;
      newYear += 1;
    }

    while (newMonth < 0) {
      newMonth += monthsInYear;
      newYear -= 1;
    }

    let newDay = day;

    if (newMonth === 13) {
      const isLeap = year % 4 === 3;
      const maxDaysInPagume = isLeap ? 6 : 5;

      if (newDay > maxDaysInPagume) {
        newDay = maxDaysInPagume;
      }
    } else {
      if (newDay > 30) {
        newDay = 30;
      }
    }

    this.$y = newYear;
    this.$M = newMonth;
    this.$D = newDay;
    this.$d = this.getGregorianDateTime();
    this.$W = this.$d.getDay();
    this.$DWM = Math.ceil(this.$D / 8);
    this.$DWY = this.calculateDayWeekInYear();
    return this;
  }

  addDays(days) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setDate(gregorianDate.getDate() + days);
    return new EthiopianDate(gregorianDate);
  }

  addHours(hours) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setHours(gregorianDate.getHours() + hours);
    return new EthiopianDate(gregorianDate);
  }

  addMinutes(minutes) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setMinutes(gregorianDate.getMinutes() + minutes);
    return new EthiopianDate(gregorianDate);
  }

  addSeconds(seconds) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setSeconds(gregorianDate.getSeconds() + seconds);
    return new EthiopianDate(gregorianDate);
  }

  addMilliseconds(milliseconds) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setMilliseconds(
      gregorianDate.getMilliseconds() + milliseconds
    );
    return new EthiopianDate(gregorianDate);
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

  // Start of the day (12:00:00.000)
  startOfDay() {
    const startOfDayDate = new Date(this.$d);
    startOfDayDate.setHours(6, 0, 0, 0);
    return new EthiopianDate(startOfDayDate);
  }

  // End of the day (11:59:59.999)
  endOfDay() {
    const endOfDayDate = new Date(this.$d);
    endOfDayDate.setHours(5, 59, 59, 999);
    return new EthiopianDate(endOfDayDate);
  }

  // Comparison Methods
  isBefore(date) {
    if (!(date instanceof EthiopianDate)) return "Invalid Date";
    return this.toGregorianDate() < date.toGregorianDate();
  }

  isAfter(date) {
    if (!(date instanceof EthiopianDate)) return "Invalid Date";
    return this.toGregorianDate() > date.toGregorianDate();
  }

  isSame(date) {
    if (!(date instanceof EthiopianDate)) return "Invalid Date";
    return (
      this.toGregorianDate().getTime() === date.toGregorianDate().getTime()
    );
  }

  // Format Date using EthiopianDateFormatter
  toString(format = "dd/MM/YYYY", lang = "") {
    return EthiopianDateFormatter.format(this, format, lang);
  }

  format(template, lang) {
    return EthiopianDateFormatter.format(this, template, lang);
  }

  // Convert EthiopianDate to Gregorian Date
  toGregorianDate() {
    return new Date(this.$d);
  }

  static diff(date1, date2, unit = "") {
    if (!(date1 instanceof EthiopianDate && date2 instanceof EthiopianDate))
      return "Invalid Date";

    return dateUtils.difference(date1, date2, unit);
  }
  diffString(date, { unit = "", useLatin = true } = {}) {
    unit = unit.toLowerCase().replace(/s$/, "");
    const result = EthiopianDate.diff(this, date, "all");

    if (typeof result === "string") {
      return result;
    }

    const timeUnitMapping = {
      year: result.full,
      month: result.byMonths,
      week: result.byWeeks,
    };

    if (timeUnitMapping[unit]) {
      return dateUtils.formatTimeParts(timeUnitMapping[unit], !useLatin);
    }

    return result.full
      ? dateUtils.formatTimeParts(result.full, !useLatin)
      : result;
  }

  static diffString(date1, date2, { unit = "", useLatin = true } = {}) {
    unit = unit.toLowerCase().replace(/s$/, "");
    console.log("date1, date2");
    const result = EthiopianDate.diff(date1, date2, "all");

    if (typeof result === "string") {
      return result;
    }

    const timeUnitMapping = {
      year: result.full,
      month: result.byMonths,
      week: result.byWeeks,
    };

    if (timeUnitMapping[unit]) {
      return dateUtils.formatTimeParts(timeUnitMapping[unit], !useLatin);
    }

    return result.full
      ? dateUtils.formatTimeParts(result.full, !useLatin)
      : result;
  }

  fromNow({ withoutSuffix = false, useLatin = false } = {}) {
    return dateUtils.toRelativeTime(
      this,
      EthiopianDate.today(),
      withoutSuffix,
      !useLatin
    );
  }
  from(date, { withoutSuffix = false, useLatin = false } = {}) {
    if (!(date instanceof EthiopianDate)) return "Invalid Date";
    return dateUtils.toRelativeTime(this, date, withoutSuffix, !useLatin);
  }
  to(date, { withoutSuffix = false, useLatin = false } = {}) {
    if (!(date instanceof EthiopianDate)) return "Invalid Date";
    return dateUtils.toRelativeTime(date, this, withoutSuffix, !useLatin);
  }
  toNow({ withoutSuffix = false, useLatin = false } = {}) {
    return dateUtils.toRelativeTime(
      EthiopianDate.today(),
      this,
      withoutSuffix,
      !useLatin
    );
  }
  static today = () => new EthiopianDate(new Date());
}

module.exports = EthiopianDate;
