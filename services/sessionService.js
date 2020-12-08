const getUserId = async (session) => (await session.get("user"))?.id;

const getUserEmail = async (session) => (await session.get("user"))?.email;

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
};

export {
  forgetUserAuthentication,
  getUserEmail,
  getUserId,
  getWeekMonth,
  saveMonth,
  saveUserAuthentication,
  saveWeek,
};
