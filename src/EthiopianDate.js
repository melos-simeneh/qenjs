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
      this.$H = Math.abs(input.getHours() - 6);
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

  // Method to calculate the difference between two EthiopianDate objects
  static difference(date1, date2) {
    const gregorianDate1 = date1.toGregorianDate();
    const gregorianDate2 = date2.toGregorianDate();

    let diffInMs = Math.abs(gregorianDate2 - gregorianDate1); // Absolute difference in milliseconds

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const years = Math.floor(diffInDays / 365.25);
    let remainingDaysAfterYears = diffInDays - years * 365.25;
    const months = Math.floor(remainingDaysAfterYears / 30);
    remainingDaysAfterYears -= months * 30;

    const remainingHours = diffInHours % 24;
    const remainingMinutes = diffInMinutes % 60;
    const remainingSeconds = diffInSeconds % 60;
    const remainingMilliseconds = diffInMs % 1000;

    return {
      years,
      months,
      days: Math.floor(remainingDaysAfterYears),
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds,
      milliseconds: remainingMilliseconds,
    };
  }

  static differenceString(date1, date2) {
    const { years, months, days, hours, minutes, seconds } =
      EthiopianDate.difference(date1, date2);
    return `${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }

  // Add / Subtract Years, Months, Days
  addYears(years) {
    return new EthiopianDate(
      this.$y + years,
      this.$M,
      this.$D,
      this.$H,
      this.$m,
      this.$s,
      this.$ms
    );
  }

  addMonths(months) {
    let newMonth = this.$M + months;
    let newYear = this.$y;

    while (newMonth > 13) {
      newYear += Math.floor(newMonth / 13);
      newMonth = newMonth % 13;
    }
    return new EthiopianDate(
      newYear,
      newMonth,
      this.$d,
      this.$H,
      this.$m,
      this.$s,
      this.$ms
    );
  }

  addDays(days) {
    const gregorianDate = this.toGregorianDate();
    gregorianDate.setDate(gregorianDate.getDate() + days);
    return new EthiopianDate(gregorianDate);
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
  toString(format = "dd/MM/YYYY HH:mm:ss A") {
    return EthiopianDateFormatter.format(format, this);
  }

  // Convert EthiopianDate to Gregorian Date
  toGregorianDate() {
    return new Date(this.$d);
  }
}

module.exports = EthiopianDate;
