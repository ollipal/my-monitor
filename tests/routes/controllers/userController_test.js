import app from "../../../app.js";
import { assert, superoak, validate } from "../../../deps.js";
import { _userRules } from "../../../services/validationService.js";

Deno.test({
  name: "GET to /auth/register renders (returns 200)",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/auth/register").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "GET to /auth/login renders (returns 200)",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/auth/login").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "GET to /auth/logout renders (returns 200)",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/auth/logout").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

const validEmailPassword = {
  email: "valid@email.com",
  password: "testpassword",
  verification: "testpassword",
};

Deno.test({
  name: "valid email + password works",
  fn: async () => {
    assert((await validate(validEmailPassword, _userRules))[0]);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "email is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEmailPassword,
            email: "",
          },
          _userRules
        )
      )[0]
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "password is required",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEmailPassword,
            password: "",
          },
          _userRules
        )
      )[0]
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "email must be a valid email",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEmailPassword,
            email: "notvalid",
          },
          _userRules
        )
      )[0]
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "password must contain at least 4 characters",
  fn: async () => {
    assert(
      !(
        await validate(
          {
            ...validEmailPassword,
            password: "tes",
            verification: "tes",
          },
          _userRules
        )
      )[0]
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
