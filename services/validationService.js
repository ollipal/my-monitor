import {
  isEmail,
  isInt,
  isNumber,
  isNumeric,
  minLength,
  minNumber,
  numberBetween,
  required,
  validate,
} from "../deps.js";

const _userRules = {
  email: [required, isEmail],
  password: [required, minLength(4)],
};

const _morningRules = {
  morningDateString: [required], // not validated to be date
  sleepDurationString: [required, isNumeric],
  sleepQualityString: [required, isNumeric],
  morningMoodString: [required, isNumeric],
  sleepDuration: [required, isNumber, minNumber(0)],
  sleepQuality: [required, isInt, numberBetween(1, 5)],
  morningMood: [required, isInt, numberBetween(1, 5)],
};

const _eveningRules = {
  eveningDateString: [required], // not validated to be date
  sportsDurationString: [required, isNumeric],
  studyDurationString: [required, isNumeric],
  eatingQualityString: [required, isNumeric],
  eveningMoodString: [required, isNumeric],
  sportsDuration: [required, isNumber, minNumber(0)],
  studyDuration: [required, isNumber, minNumber(0)],
  eatingQuality: [required, isInt, numberBetween(1, 5)],
  eveningMood: [required, isInt, numberBetween(1, 5)],
};

const validateUser = async (data) => await validate(data, _userRules);

const validateMorningReport = async (data) =>
  await validate(data, _morningRules);

const validateEveningReport = async (data) =>
  await validate(data, _eveningRules);

export {
  _eveningRules,
  _morningRules,
  // testing
  _userRules,
  validateEveningReport,
  validateMorningReport,
  // normal
  validateUser,
};
