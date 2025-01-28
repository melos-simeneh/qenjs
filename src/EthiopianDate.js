const EthiopianDateConverter = require("./EthiopianDateConverter");
const EthiopianDateFormatter = require("./EthiopianDateFormatter");

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

  constructor(input, isNight = false) {
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
      this.$DWM = Math.ceil(this.$D / 8);
      this.$DWY = this.calculateDayWeekInYear();
    }
  }

  get Year() {
    return this.$y;
  }

  get Month() {
    return this.$m;
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
  isLeapYear(year) {
    return year % 4 === 3;
  }

  calculateDayWeekInYear() {
    const daysInMonth = Array(12)
      .fill(30)
      .concat(this.isLeapYear(this.$y) ? 6 : 5);
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

  static difference(date1, date2, unit = "") {
    const MS_PER_SECOND = 1000;
    const MS_PER_MINUTE = MS_PER_SECOND * 60;
    const MS_PER_HOUR = MS_PER_MINUTE * 60;
    const MS_PER_DAY = MS_PER_HOUR * 24;
    const MS_PER_MONTH = MS_PER_DAY * 30.44;
    const MS_PER_YEAR = MS_PER_DAY * 365.25; // Account for leap years

    const gregorianDate1 = date1.toGregorianDate();
    const gregorianDate2 = date2.toGregorianDate();
    const diffInMs = Math.abs(gregorianDate2 - gregorianDate1);

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
      EthiopianDate.difference(date1, date2);
    return `${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
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

    return new EthiopianDate(date);
  }

  addMonths(months) {
    let newMonth = this.$M + months;
    let newYear = this.$y;

    while (newMonth > 13) {
      newYear += Math.floor(newMonth / 13);
      newMonth = newMonth % 13;
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

    return new EthiopianDate(date);
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

  // Start of the day (00:00:00.000)
  startOfDay() {
    const startOfDayDate = new Date(this.$d);
    startOfDayDate.setHours(0, 0, 0, 0);
    return new EthiopianDate(startOfDayDate);
  }

  // End of the day (23:59:59.999)
  endOfDay() {
    const endOfDayDate = new Date(this.$d);
    endOfDayDate.setHours(23, 59, 59, 999);
    return new EthiopianDate(endOfDayDate);
  }

  // Comparison Methods
  isBefore(date) {
    return this.toGregorianDate() < date.toGregorianDate();
  }

  isAfter(date) {
    return this.toGregorianDate() > date.toGregorianDate();
  }

  isSame(date) {
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
}

module.exports = EthiopianDate;
