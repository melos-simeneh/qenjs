class EthiopianDateFormatter {
  // Constants for months and days of the week in Ethiopian and English
  static MONTHS = {
    ethiopian: [
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
    ],
    english: [
      "Meskerem",
      "Tikimt",
      "Hidar",
      "Tahsas",
      "Tir",
      "Yekatit",
      "Megabit",
      "Miazia",
      "Ginbot",
      "Sene",
      "Hamle",
      "Nehase",
      "Pagume",
    ],
  };

  static DAYS_OF_WEEK = {
    ethiopian: ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"],
    english: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  };

  static TIME_OF_DAY_LABELS = {
    ethiopian: {
      morning: "ጠዋት", // 6 AM - 11 AM
      afternoon: "ከሰዓት", // 12 PM - 5 PM
      evening: "ምሽት", // 6 PM - 11 PM
      night: "ለሊት", // 12 AM - 5 AM
    },
    english: {
      morning: "Morning", // 6 AM - 11 AM
      afternoon: "Afternoon", // 12 PM - 5 PM
      evening: "Evening", // 6 PM - 11 PM
      night: "Night", // 12 AM - 5 AM
    },
  };

  static LANGUAGE_MAP = {
    am: "ethiopian",
    amh: "ethiopian",
    amharic: "ethiopian",
    eth: "ethiopian",
    en: "english",
    eng: "english",
    english: "english",
  };

  static _getLanguage(language) {
    return (
      EthiopianDateFormatter.LANGUAGE_MAP[language] ||
      EthiopianDateFormatter.LANGUAGE_MAP["amh"]
    );
  }

  static _getTimeOfDay(hour, language) {
    const lang = EthiopianDateFormatter._getLanguage(language);
    console.log(lang, language);
    if (hour >= 6 && hour < 12) {
      return EthiopianDateFormatter.TIME_OF_DAY_LABELS[lang].morning;
    } else if (hour >= 12 && hour < 18) {
      return EthiopianDateFormatter.TIME_OF_DAY_LABELS[lang].afternoon;
    } else if (hour >= 18 && hour < 24) {
      return EthiopianDateFormatter.TIME_OF_DAY_LABELS[lang].evening;
    } else {
      return EthiopianDateFormatter.TIME_OF_DAY_LABELS[lang].night;
    }
  }

  static format(
    ethiopianDate,
    format = "dd/MM/YYY hh:mm:ss",
    language = "ethiopian"
  ) {
    const pad = (number, length = 2) =>
      !isNaN(number) ? String(number).padStart(length, "0") : number;

    if (Object.values(ethiopianDate).some((component) => isNaN(component))) {
      return "Invalid Date";
    }

    const { $y, $M, $D, $W, $H, $m, $s, $ms } = ethiopianDate;
    const lang = EthiopianDateFormatter._getLanguage(language);
    const hours = ethiopianDate.toGregorianDate().getHours();
    const timeOfDay = EthiopianDateFormatter._getTimeOfDay(hours, lang);

    const formatMap = {
      YYYY: pad($y, 4),
      YY: pad($y % 100, 2),
      MMMM: EthiopianDateFormatter.MONTHS[lang][$M - 1],
      MMM: EthiopianDateFormatter.MONTHS[lang][$M - 1]?.slice(0, 2),
      MM: pad($M),
      M: $M,
      DDDD: EthiopianDateFormatter.DAYS_OF_WEEK[lang][$W],
      DDD: EthiopianDateFormatter.DAYS_OF_WEEK[lang][$W]?.slice(0, 2),
      dd: pad($D),
      d: $D,
      HH: pad($H),
      H: $H,
      mm: pad($m),
      ss: pad($s),
      SSS: pad($ms, 3),
      A: timeOfDay,
      a: timeOfDay,
    };

    return format.replace(
      /\b(YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|dd|d|HH|H|mm|ss|SSS|A|a)\b/g,
      (match) => formatMap[match] || match
    );
  }
}

module.exports = EthiopianDateFormatter;
