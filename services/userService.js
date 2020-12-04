import { executeQuery } from "../database/database.js";
import { compare, hash } from "../deps.js";

const _getUser = async (email) => {
  /* if successfull:
   *    returns user
   * else
   *    returns null
   */

  const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);
  if (res?.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else {
    return null;
  }
};

const registerUser = async (email, password) => {
  /* if successfull:
   *    returns true
   * else
   *    returns false
   */

  if ((await _getUser(email)) === null) {
    return false;
  } else {
    await executeQuery(
      "INSERT INTO users (email, password) VALUES ($1, $2);",
      email,
      await hash(password),
    );
    return true;
  }
};

const loginUser = async (email, password) => {
  /* if successfull:
   *    returns [true, userId]
   * else
   *    returns [false, null]
   */

  const user = await _getUser(email);
  if (user === null || !(await compare(password, user.password))) {
    return [false, null];
  } else {
    return [true, user.id];
  }
};

export { loginUser, registerUser };
