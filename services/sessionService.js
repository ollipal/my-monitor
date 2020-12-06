const getUserId = async (session) => (await session.get("user"))?.id;

const saveUserAuthentication = async (session, id, email) => {
  await session.set("authenticated", true);
  await session.set("user", { id, email });
};

const forgetUserAuthentication = async (session) => {
  await session.set("authenticated", false);
  await session.set("user", { id: null, email: null });
};

export { forgetUserAuthentication, getUserId, saveUserAuthentication };
