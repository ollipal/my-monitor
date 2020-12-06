import {
  formattedDate,
  getUserReportAveragesByWeekOrMonth,
} from "../../services/reportService.js";
import { assertEquals, assertThrowsAsync } from "../../deps.js";

Deno.test("formattedDate formats correctly", async () => {
  // js Date month starts at 0...
  assertEquals(formattedDate(new Date(2000, 0, 1)), "2000-01-01");
});

Deno.test(
  "getUserReportAveragesByWeekOrMonth throws error " +
    "when no week or month is passed",
  async () => {
    assertThrowsAsync(
      async () => {
        await getUserReportAveragesByWeekOrMonth({});
      },
      Error,
      "Define week or month (only one)",
    );
  },
);

Deno.test(
  "getUserReportAveragesByWeekOrMonth throws error " +
    "when both week and month is passed",
  async () => {
    assertThrowsAsync(
      async () => {
        await getUserReportAveragesByWeekOrMonth({
          userId: "user123",
          week: 1,
          month: 2,
        });
      },
      Error,
      "Define week or month (only one)",
    );
  },
);
