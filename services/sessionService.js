const getUserId = async (session) => (await session.get("user"))?.id;

const saveUserAuthentication = async (session, id, email) => {
  await session.set("authenticated", true);
  await session.set("user", { id, email });
};

export { getUserId, saveUserAuthentication };
