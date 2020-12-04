import { executeQuery } from "../database/database.js";
import { compare, hash } from "../deps.js";

const registerUser = async (email, password) => {
  const existingUsers = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email,
  );
  if (existingUsers.rowCount > 0) {
    return "The email is already reserved.";
  }

  const passwordHash = await hash(password);
  await executeQuery(
    "INSERT INTO users (email, password) VALUES ($1, $2);",
    email,
    passwordHash,
  );
  return "Registration successful!";
};

const loginUser = async (email, password) => {
  /* if successfull:
   *    returns [true, userId]
   * else
   *    returns [false, null]
   */

  // check if the email exists in the database
  const res = await executeQuery(
    "SELECT * FROM users WHERE email = $1;",
    email,
  );
  if (res.rowCount === 0) {
    return [false, null];
  }

  // take the first row from the results
  const userObj = res.rowsOfObjects()[0];

  const passwordHash = userObj.password;

  const passwordCorrect = await compare(password, passwordHash);
  if (!passwordCorrect) {
    return [false, null];
  }
  return [true, userObj.id];
};

export { loginUser, registerUser };
