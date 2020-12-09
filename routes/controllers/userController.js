import { isEmail, minLength, required, validate } from "../../deps.js";
import { loginUser, registerUser } from "../../services/userService.js";
import {
  forgetUserAuthentication,
  getAndForgetValuesErrors,
  getUserEmail,
  saveUserAuthentication,
  saveValuesErrors,
} from "../../services/sessionService.js";

const getAuthRegister = async ({ render, session }) => {
  const [values, errors] = await getAndForgetValuesErrors(session);
  render("authRegister.ejs", {
    email: await getUserEmail(session),
    errors,
    values,
  });
};

const getAuthLogin = async ({ render, session }) => {
  const [values, errors] = await getAndForgetValuesErrors(session);
  render("authLogin.ejs", {
    email: await getUserEmail(session),
    errors,
    values,
  });
};

const getAuthLogout = async ({ render, session }) => {
  render("authLogout.ejs", { email: await getUserEmail(session) });
};

const userRules = {
  email: [required, isEmail],
  password: [required, minLength(4)],
};

const _getData = async (request) => {
  const body = request.body();
  const params = await body.value;
  return {
    email: params.get("email"),
    password: params.get("password"),
    verification: params.get("verification"),
    errors: {},
  };
};

const postAuthRegister = async ({ request, response, session }) => {
  const data = await _getData(request);
  // check validation rules
  const validationResult = await validate(data, userRules);
  let passes = validationResult[0];
  const errors = validationResult[1];
  // check verfification
  if (data.password !== data.verification) {
    errors.verification = { mismatch: "The entered passwords did not match" };
    passes = false;
  }
  // if ok so far try registering
  if (passes) {
    const registerationSuccess = await registerUser(data.email, data.password);
    if (!registerationSuccess) {
      errors.email = {
        ...(errors?.email ? errors.email : {}),
        ...{ reserved: "The email is already reserved" },
      };
      passes = false;
    }
  }

  if (passes) {
    response.redirect("/auth/login");
  } else {
    await saveValuesErrors(session, { email: data.email }, errors);
    response.redirect("/auth/register");
  }
};

const postAuthLogin = async ({ request, response, session }) => {
  const data = await _getData(request);
  const [loginSuccessfull, userId] = await loginUser(data.email, data.password);
  if (loginSuccessfull) {
    await saveUserAuthentication(session, userId, data.email);
    response.redirect("/");
  } else {
    await saveValuesErrors(
      session,
      {},
      { email: { _: "Invalid email or password" } },
    );
    response.redirect("/auth/login");
  }
};

const postAuthLogout = async ({ response, session }) => {
  await forgetUserAuthentication(session);
  response.redirect("/");
};

export {
  getAuthLogin,
  getAuthLogout,
  getAuthRegister,
  postAuthLogin,
  postAuthLogout,
  postAuthRegister,
};
