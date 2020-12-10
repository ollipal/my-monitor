import app from "../../../app.js";
import { assert, superoak, validate } from "../../../deps.js";
import {
  _eveningRules,
  _morningRules,
} from "../../../services/validationService.js";

Deno.test({
  name: "GET to / returns 200",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

const validMorningReport = {
  morningDateString: "01-01-2020",
  sleepDurationString: "1",
  sleepQualityString: "1",
  morningMoodString: "1",
  sleepDuration: 1.0,
  sleepQuality: 1.0,
  morningMood: 1.0,
};

const validEveningReport = {
  eveningDateString: "01-01-2020",
  sportsDurationString: "1",
  studyDurationString: "1",
  eatingQualityString: "1",
  eveningMoodString: "1",
  sportsDuration: 1,
  studyDuration: 1,
  eatingQuality: 1,
  eveningMood: 1,
};

Deno.test({
  name: "valid morning report works",
  fn: async () => {
    assert((await validate(validMorningReport, _morningRules))[0]);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "valid evening report works",
  fn: async () => {
    assert((await validate(validEveningReport, _eveningRules))[0]);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "morning date is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            morningDateString: "",
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "sleep duration is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            sleepDurationString: "",
            sleepDuration: NaN,
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "sleep quality is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            sleepQualityString: "",
            sleepQuality: NaN,
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "morning mood is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            morningMoodString: "",
            morningMood: NaN,
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "sleep duration cannot be negative",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            sleepDurationString: "-1",
            sleepDuration: -1.0,
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "sleep quality must be integer",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            sleepQualityString: "1.5",
            sleepQuality: 1.5,
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "morning mood must be integer",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            morningMoodString: "1.5",
            morningMood: 1.5,
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "sleep quality between 1 and 5",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            sleepQualityString: "6",
            sleepQuality: 6.0,
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "morning mood between 1 and 5",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validMorningReport,
            morningMoodString: "6",
            morningMood: 6.0,
          },
          _morningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "evening date is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            eveningDateString: "",
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "sports duration is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            sportsDurationString: "",
            sportsDuration: NaN,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "study duration is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            studyDurationString: "",
            studyDuration: NaN,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "eating quality is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            eatingQualityString: "",
            eatingQuality: NaN,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "evening mood is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            eveningMoodString: "",
            eveningMood: NaN,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "sports duration cannot be negative",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            sportsDurationString: "-1",
            sportsDuration: -1,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "study duration cannot be negative",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            studyDurationString: "-1",
            studyDuration: -1,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "eating quality must be integer",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            eatingQualityString: "1.5",
            eatingQuality: 1.5,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "eating quality must be between 1 and 5",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            eatingQualityString: "6",
            eatingQuality: 6,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "evening mood must be integer",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            eveningMoodString: "1.5",
            eveningMood: 1.5,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "evening mood must be between 1 and 5",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEveningReport,
            eveningMoodString: "6",
            eveningMood: 6,
          },
          _eveningRules,
        )
      )[0],
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
