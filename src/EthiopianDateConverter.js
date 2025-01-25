class EthiopianDateConverter {
  static JdOffset = 1723856;

  static toEthiopianDate(date) {
    const jdn = this.toJDN(date);
    return this.toEthiopianDateFromJDN(jdn);
  }

  static toJDN(date) {
    let a, y, m;
    a = Math.floor((14 - date.getMonth() + 1) / 12);
    y = date.getFullYear() + 4800 - a;
    m = date.getMonth() + 1 + 12 * a - 3;

    return (
      date.getDate() +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045
    );
  }

  static toEthiopianDateFromJDN(jdn) {
    let year, month, day, r, n;

    r = (jdn - EthiopianDateConverter.JdOffset) % 1461;
    n = (r % 365) + 365 * Math.floor(r / 1460);

    year =
      4 * Math.floor((jdn - EthiopianDateConverter.JdOffset) / 1461) +
      Math.floor(r / 365) -
      Math.floor(r / 1460);
    month = Math.floor(n / 30) + 1;
    day = (n % 30) + 1;
    return { year, month, day };
  }

  // To Gregorian Date
  static toGregorianDate(year, month, day) {
    this.validate(year, month, day);
    const jdn = this.fromEthiopianDateToJDN(year, month, day);
    return this.toGregorianDateFromJDN(jdn);
  }

  static toGregorianDateFromJDN(jdn) {
    let year, month, day;

    let r = jdn + 68569;
    let n = Math.floor((4 * r) / 146097);

    r = r - Math.floor((146097 * n + 3) / 4);
    year = Math.floor((4000 * (r + 1)) / 1461001);
    r = r - Math.floor((1461 * year) / 4) + 31;
    month = Math.floor((80 * r) / 2447);
    day = r - Math.floor((2447 * month) / 80);
    r = Math.floor(month / 11);
    month = month + 2 - 12 * r;
    year = 100 * (n - 49) + year + r;

    return new Date(year, month - 1, day); // Month is zero-indexed in JS Date
  }

  static validate(year, month, day) {
    if (
      month < 1 ||
      month > 13 ||
      (month === 13 && year % 4 === 3 && day > 6) ||
      (month === 13 && year % 4 !== 3 && day > 5) ||
      day < 1 ||
      day > 30
    ) {
      throw new Error(
        "Year, Month, and Day parameters describe an un-representable EthiopianDateTime."
      );
    }
  }

  static fromEthiopianDateToJDN(year, month, day) {
    return (
      EthiopianDateConverter.JdOffset +
      365 +
      365 * (year - 1) +
      Math.floor(year / 4) +
      30 * month +
      day -
      31
    );
  }
}
module.exports = EthiopianDateConverter;
