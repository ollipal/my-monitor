import { loginUser, registerUser } from "../../services/userService.js";

const getAuthRegister = async ({ render }) => {
  render("authRegister.ejs");
};
const getAuthLogin = async ({ render }) => {
  render("authLogin.ejs");
};

const postAuthRegister = async ({ request, response }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");
  const verification = params.get("verification");

  if (password !== verification) {
    response.body = "The entered passwords did not match";
    return;
  }

  // TODO validation

  response.body = await registerUser(email, password);

  // TODO redirect
};

const postAuthLogin = async ({ request, response, session }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const password = params.get("password");

  // TODO validation
  [response.status, response.body] = await loginUser(email, password, session);
  // TODO redirect
};

export { getAuthLogin, getAuthRegister, postAuthLogin, postAuthRegister };
