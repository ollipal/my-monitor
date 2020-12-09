const getUserId = async (session) => (await session.get("user"))?.id;

const getUserEmail = async (session) => (await session.get("user"))?.email;

const saveValuesErrors = async (session, values, errors) => {
  await session.set("values", values);
  await session.set("errors", errors);
};

const getAndForgetValuesErrors = async (session) => {
  const values = await session.get("values");
  const errors = await session.get("errors");
  await saveValuesErrors(session, null, null);
  return [values, errors];
};

const getWeekMonth = async (session) => [
  Number(await session.get("week")),
  Number(await session.get("month")),
];

const saveWeek = async (session, week) => {
  await session.set("week", week);
};

const saveMonth = async (session, month) => {
  await session.set("month", month);
};

const saveUserAuthentication = async (session, id, email) => {
  await session.set("authenticated", true);
  await session.set("user", { id, email });
};

const forgetUserAuthentication = async (session) => {
  await session.set("authenticated", false);
  await session.set("user", { id: null, email: null });
  await saveWeek(session, null);
  await saveMonth(session, null);
  await saveValuesErrors(session, null, null);
};

export {
  forgetUserAuthentication,
  getAndForgetValuesErrors,
  getUserEmail,
  getUserId,
  getWeekMonth,
  saveMonth,
  saveUserAuthentication,
  saveValuesErrors,
  saveWeek,
};
