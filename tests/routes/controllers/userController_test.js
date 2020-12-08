import app from "../../../app.js";
import { superoak } from "../../../deps.js";

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
