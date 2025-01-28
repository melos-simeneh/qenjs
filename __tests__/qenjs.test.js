const qenjs = require("../src/index");

test("adds days to date", () => {
  const q = qenjs("2017-05-19");
  q.add(5, "day");
  expect(q.format("YYYY-MM-DD")).toBe("2025-01-06");
});

test("subtracts days from date", () => {
  const q = dayjs("2025-01-10");
  q.subtract(5, "day");
  expect(q.format("YYYY-MM-DD")).toBe("2025-01-05");
});

test("formats date correctly (YYYY-MM-DD)", () => {
  const q = dayjs("2025-01-01");
  expect(q.format("YYYY-MM-DD")).toBe("2025-01-01");
});

test("formats date correctly (YY-MM-DD)", () => {
  const q = dayjs("2025-01-01");
  expect(q.format("YY-MM-DD")).toBe("25-01-01");
});

test("formats date correctly (MMMM DD, YYYY)", () => {
  const q = dayjs("2025-01-01");
  expect(q.format("MMMM DD, YYYY")).toBe("January 01, 2025");
});

test("formats date correctly (MMM DD, YYYY)", () => {
  const q = dayjs("2025-01-01");
  expect(q.format("MMM DD, YYYY")).toBe("Jan 01, 2025");
});

test("compares two dates", () => {
  const q1 = dayjs("2025-01-01");
  const q2 = dayjs("2025-01-02");
  expect(q1.isBefore(q2.toDate())).toBe(true);
  expect(q2.isAfter(q1.toDate())).toBe(true);
});

test("shows time from now", () => {
  const q = dayjs("2025-01-01");
  const result = q.fromNow();
  expect(result).toMatch(
    /seconds ago|minutes ago|hours ago|days ago|months ago|years ago/
  );
});
