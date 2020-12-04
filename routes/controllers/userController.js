import { loginUser, registerUser } from "../../services/userService.js";

const getAuthRegister = async ({ render }) => {
  render("authRegister.ejs");
};
const getAuthLogin = async ({ render }) => {
  render("authLogin.ejs");
};

const _getEmailPasswordVerification = async (request) => {
  const body = request.body();
  const params = await body.value;

  return [
    params.get("email"),
    params.get("password"),
    params.get("verification"),
  ];
};

const postAuthRegister = async ({ request, response }) => {
  const [email, password, verification] = await _getEmailPasswordVerification(
    request,
  );

  if (password !== verification) {
    response.body = "The entered passwords did not match";
    return;
  }

  // TODO validation

  response.body = await registerUser(email, password);

  // TODO redirect
};

const postAuthLogin = async ({ request, response, session }) => {
  const [email, password, _] = await _getEmailPasswordVerification(request);

  // TODO validation
  [response.status, response.body] = await loginUser(email, password, session);
  // TODO redirect
};

export { getAuthLogin, getAuthRegister, postAuthLogin, postAuthRegister };
