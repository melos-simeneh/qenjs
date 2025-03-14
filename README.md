# QENJS: Ethiopian Date Handling Library

QENJS is a library for working with Ethiopian Dates, providing convenient methods for creating, formatting, manipulating, and converting Ethiopian dates. This README will guide you through various examples and functionalities available in the QENJS library.

## Features

- Convert between Ethiopian and Gregorian dates.
- Format ethiopian dates in Amharic and latin.
- Format gregorian dates
- Calculate date difference and relative time

## Installation

You can install qenjs via npm:

```bash
npm install qenjs
```

Alternatively, if you're using Yarn:

```bash
yarn add qenjs
```

## Usage

Here's how you can start using MiniDayjs in your project:

1. Create Ethiopian Date
    You can create an Ethiopian date using the following methods:

    ```javascript
    const ethiopianDate = qenjs();
    console.log(ethiopianDate.toString()); // Outputs current ethiopian date

    const ethiopianDate2 = qenjs(2017, 1, 1);
    console.log(ethiopianDate2.toString()); // Outputs  01/01/2017

    const ethiopianDate3 = qenjs("2017-01-29");
    console.log(ethiopianDate3.format("DDDD, MMMM dd YYYY")); // Outputs: ረቡዕ, መስከረም 29 2017

    const ethiopianDate4= qenjs({ year: 2017, month: 4, day: 15 });
    console.log(ethiopianDate4.toString("DDDD, MMMM dd YYYY", "eng")); // Maksegno, Tahsas 15 2017

    const ethiopianDate4= qenjs.fromGregorianDate(new Date());
    console.log(ethiopianDate4.toString("DDDD, MMMM dd YYYY")); // Outputs current ethiopian date

    const ethiopianNightDate = qenjs("2017-01-29", { isNight: true });
    console.log(ethiopianNightDate.toString("dd/MM/YYYY HH:mm:ss A")); // 29/01/2017 01:00:00 ምሽት

    ```

2. Formatting Ethiopian Date
  
    You can format Ethiopian dates using custom patterns. The default language is Amharic, but you can specify another language if needed.

    ```javascript
        const ethiopianDate = qenjs({ year: 2017, month: 4, day: 15 });
        console.log(ethiopianDate.format("MMMM dd, YYYY", "amh")); // ታኅሣሥ 15, 2017

        console.log(ethiopianDate4.toString("DDDD, MMMM dd YYYY", "eng")); // Maksegno, Tahsas 15 2017

        console.log(qenjs.format(ethiopianDate3, "MMMM d, YYYY")); // ታኅሣሥ 15, 2017

    ```

3. Adding/Subtracting Days

   You can manipulate Ethiopian dates by adding or subtracting days.

    Example: Adding Days

    ```javascript
    const ethiopianDate = qenjs(2017, 1, 1);
    const newDate = ethiopianDate.addDays(700);
    console.log(newDate.toString("DDDD, MMMM dd, YYYY")); // Add 700 days to the date
    ```

    Example: Subtracting Days

    ```javascript
    const ethiopianDate = qenjs(2017, 1, 1);
    const previousDate = ethiopianDate.subtractDays(5);
    console.log(previousDate.toString()); // Subtract 5 days from the date
    ```

4. Comparing Dates

    QENJS provides methods to compare Ethiopian dates (e.g., checking if a date is before or after another date).

    Example: Check if Date is Before

    ```javascript
    const date1 = qenjs(2025, 1, 29);
    const date2 = qenjs(2024, 1, 29);
    console.log(date1.isBefore(date2)); // Should print false
    console.log(date1.isAfter(date2)); // Should print false
    console.log(date1.isSame(date2)); // Should print true
    ```

5. Converting to Gregorian Date

    QENJS supports converting Ethiopian dates to Gregorian dates.

    Example: Convert Ethiopian Date to Gregorian Date

    ```javascript
    const ethiopianDate = qenjs({ year: 2017, month: 4, day: 15 });
    const gregorianDate = qenjs.toGregorianDate(ethiopianDate);
    console.log(gregorianDate.toISOString()); // Outputs the Gregorian equivalent
    ```

6. Relative Time
    QENJS supports relative time, showing how much time has passed since or until a certain date.

    Example: Get Relative Time

    ```javascript
    Copy
    const ethiopianDate = qenjs(2017, 4, 15);
    console.log(ethiopianDate.fromNow()); // Outputs relative time like "X days ago" 
    ```

7. Date Differences
    QENJS provides methods to calculate the difference between two Ethiopian dates.

    Example: Date Difference

    ```javascript
    const date1 = qenjs(2017, 1, 1);
    const date2 = qenjs(2017, 13, 5);
    console.log(qenjs.diff(date1, date2)); // Outputs the difference in days, months, or years
    console.log(qenjs.diff(date1, date2, "days")); // Difference in days
    ```
