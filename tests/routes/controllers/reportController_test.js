import app from "../../../app.js";
import { superoak } from "../../../deps.js";

Deno.test({
  name: "GET to / returns 200 (redirects to /auth/login)",
  fn: async () => {
    const testClient = await superoak(app);
    await testClient.get("/").expect(200);
  },
  sanitizeResources: false, // TODO why these options are needed? Database Pool stays open maybe?
  sanitizeOps: false,
});
