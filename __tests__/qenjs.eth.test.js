const qenjs = require("../src/index");

describe("qenjs Library Tests", () => {
  // Test date creation
  describe("Date Creation", () => {
    test("should create an EthiopianDate instance from a string", () => {
      const date = qenjs("2014-07-08");
      expect(date).toBeInstanceOf(qenjs.EthiopianDate);
      expect(date.format("YYYY-MM-dd")).toBe("2014-07-08");
    });

    test("should create an EthiopianDate instance from an object", () => {
      const date = qenjs({ year: 2014, month: 7, day: 8 });
      expect(date).toBeInstanceOf(qenjs.EthiopianDate);
      expect(date.format("YYYY-MM-dd")).toBe("2014-07-08");
    });

    test("should return 'Invalid Date' for invalid input", () => {
      const date = qenjs("invalid-date");
      expect(date.format("YYYY-MM-dd")).toBe("Invalid Date");
    });
  });

  // Test date formatting
  describe("Date Formatting", () => {
    test("should format date as 'YYYY-MM-dd'", () => {
      const date = qenjs("2014-07-08");
      expect(date.format("YYYY-MM-dd")).toBe("2014-07-08");
    });

    test("should format date as 'MMMM dd, YYYY' in English", () => {
      const date = qenjs("2014-07-08");
      expect(date.format("MMMM dd, YYYY", "eng")).toBe("Megabit 08, 2014");
    });

    test("should format date as 'MMM dd, YYYY' in English", () => {
      const date = qenjs("2014-07-08");
      expect(date.format("MMM dd, YYYY", "eng")).toBe("Meg 08, 2014");
    });
  });

  // Test date conversion
  describe("Date Conversion", () => {
    test("should convert EthiopianDate to GregorianDate", () => {
      const ethDate = qenjs("2014-07-08");
      const gregDate = qenjs.toGregorianDate(ethDate);
      expect(gregDate).toBeInstanceOf(Date);
      expect(gregDate.toISOString()).toBe("2022-03-17T04:00:00.000Z"); // Example conversion
    });

    test("should convert GregorianDate to EthiopianDate", () => {
      const gregDate = new Date("2025-03-22");
      const ethDate = qenjs.fromGregorianDate(gregDate);
      expect(ethDate).toBeInstanceOf(qenjs.EthiopianDate);
      expect(ethDate.format("YYYY-MM-dd")).toBe("2017-07-13");
    });
  });

  // Test date arithmetic
  describe("Date Arithmetic", () => {
    test("should add days to a date", () => {
      const date = qenjs("2017-07-08");
      const newDate = date.add(5, "day");
      expect(newDate.format("YYYY-MM-dd")).toBe("2017-07-13");
    });

    test("should subtract months from a date", () => {
      const date = qenjs("2014-07-08");
      const newDate = date.subtract(2, "month");
      expect(newDate.format("YYYY-MM-dd")).toBe("2014-05-08");
    });

    test("should add years to a date", () => {
      const date = qenjs("2014-07-08");
      const newDate = date.add(3, "year");
      expect(newDate.format("YYYY-MM-dd")).toBe("2017-07-08");
    });
  });

  // Test date comparison
  describe("Date Comparison", () => {
    test("should check if a date is before another date", () => {
      const date1 = qenjs("2014-07-08");
      const date2 = qenjs("2014-07-09");
      expect(date1.isBefore(date2)).toBe(true);
    });

    test("should check if a date is after another date", () => {
      const date1 = qenjs("2014-07-09");
      const date2 = qenjs("2014-07-08");
      expect(date1.isAfter(date2)).toBe(true);
    });

    test("should check if two dates are the same", () => {
      const date1 = qenjs("2014-07-08");
      const date2 = qenjs("2014-07-08");
      expect(date1.isSame(date2)).toBe(true);
    });
  });

  // Test relative time
  describe("Relative Time", () => {
    test("should return relative time from now", () => {
      const date = qenjs().subtract(1, "day");
      const relativeTime = date.fromNow();
      expect(relativeTime).toMatch(/day ago/);
    });

    test("should return relative time in the future", () => {
      const date = qenjs().add(2, "day");
      const relativeTime = date.fromNow();
      expect(relativeTime).toMatch(/in 2 days/);
    });
  });
});
