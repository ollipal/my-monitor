import { loginUser, registerUser } from "../../services/userService.js";
import {
  forgetUserAuthentication,
  saveUserAuthentication,
} from "../../services/sessionService.js";

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
  if (await registerUser(email, password)) {
    response.redirect("/auth/login");
  } else {
    response.body = "The email is already reserved.";
    // TODO redirect
  }
};

const postAuthLogin = async ({ request, response, session }) => {
  const [email, password, _] = await _getEmailPasswordVerification(request);

  // TODO validation
  const [loginSuccessfull, userId] = await loginUser(email, password);
  if (loginSuccessfull) {
    await saveUserAuthentication(session, userId, email);
    response.redirect("/");
  } else {
    response.status = 401;
    response.body = "login failed";
    // TODO redirect
  }
};

const postAuthLogout = async ({ response, session }) => {
  await forgetUserAuthentication(session);
  response.redirect("/auth/login");
};

export {
  getAuthLogin,
  getAuthRegister,
  postAuthLogin,
  postAuthLogout,
  postAuthRegister,
};
