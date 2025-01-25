class EthiopianDateFormatter {
  static timeOfDayLabels = {
    morning: "ጠዋት", // 6 AM - 11 AM
    afternoon: "ከሰዓት", // 12 PM - 5 PM
    evening: "ምሽት", // 6 PM - 11 PM
    night: "ለሊት", // 12 AM - 5 AM
  };

  // Reusable _pad method for padding numbers to a specific length
  static _pad(number, length = 2) {
    return !isNaN(number) ? String(number).padStart(length, "0") : number;
  }

  static format(format, ethiopianDate) {
    if (Object.values(ethiopianDate).some((component) => isNaN(component))) {
      return "Invalid Date";
    }
    const months = [
      "መስከረም",
      "ጥቅምት",
      "ኅዳር",
      "ታኅሣሥ",
      "ጥር",
      "የካቲት",
      "መጋቢት",
      "ሚያዝያ",
      "ግንቦት",
      "ሰኔ",
      "ሐምሌ",
      "ነሐሴ",
      "ጳጉሜን",
    ];
    const daysOfWeek = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];
    const formatMap = {
      YYYY: EthiopianDateFormatter._pad(ethiopianDate.$y, 4),
      YY: EthiopianDateFormatter._pad(ethiopianDate.$y % 100, 2),
      MMMM: months[ethiopianDate.$M - 1],
      MMM: months[ethiopianDate.$M - 1]?.slice(0, 2),
      MM: EthiopianDateFormatter._pad(ethiopianDate.$M),
      M: ethiopianDate.$M,
      DDDD: daysOfWeek[ethiopianDate.$W],
      DDD: daysOfWeek[ethiopianDate.$W]?.slice(0, 2),
      dd: EthiopianDateFormatter._pad(ethiopianDate.$D),
      d: ethiopianDate.$D,
      HH: EthiopianDateFormatter._pad(ethiopianDate.$H),
      H: ethiopianDate.$H,
      mm: EthiopianDateFormatter._pad(ethiopianDate.$m),
      ss: EthiopianDateFormatter._pad(ethiopianDate.$s),
      SSS: EthiopianDateFormatter._pad(ethiopianDate.$ms, 3),
    };

    let formattedDate = format.replace(
      /\b(YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|dd|d|HH|H|hh|h|mm|m|ss|SSS|A|a)\b/g,
      (match) => {
        if (match === "A" || match === "a") {
          let timeOfDay;
          let hour = ethiopianDate.toGregorianDate().getHours();
          if (hour >= 6 && hour < 12) {
            timeOfDay = EthiopianDateFormatter.timeOfDayLabels.morning;
          } else if (hour >= 12 && hour < 19) {
            timeOfDay = EthiopianDateFormatter.timeOfDayLabels.afternoon;
          } else if (hour >= 0 && hour < 6) {
            timeOfDay = EthiopianDateFormatter.timeOfDayLabels.night;
          } else {
            timeOfDay = EthiopianDateFormatter.timeOfDayLabels.evening;
          }
          return timeOfDay;
        }
        return formatMap[match] || match;
      }
    );

    return formattedDate;
  }
}

module.exports = EthiopianDateFormatter;
