import {
  _getUserEveningAveragesByWeekOrMonth,
  _getUserMorningAveragesByWeekOrMonth,
  formattedDate,
} from "../../services/reportService.js";
import { assertEquals, assertThrowsAsync } from "../../deps.js";

Deno.test("formattedDate formats correctly", async () => {
  // js Date month starts at 0...
  assertEquals(formattedDate(new Date(2000, 0, 1)), "2000-01-01");
});

Deno.test({
  name: "_getUserMorningAveragesByWeekOrMonth throws error " +
    "when no week or month is passed",
  fn: async () => {
    assertThrowsAsync(
      async () => {
        await _getUserMorningAveragesByWeekOrMonth({
          userId: 1,
          year: 2020,
        });
      },
      Error,
      "Define week or month (only one)",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "_getUserMorningAveragesByWeekOrMonth throws error " +
    "when both week and month is passed",
  fn: async () => {
    assertThrowsAsync(
      async () => {
        await _getUserMorningAveragesByWeekOrMonth({
          userId: 1,
          week: 1,
          month: 2,
          year: 2020,
        });
      },
      Error,
      "Define week or month (only one)",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
