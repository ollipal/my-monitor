import app from "../../../app.js";
import { superoak } from "../../../deps.js";

Deno.test("GET to / returns 200 (redirects to /auth/login)", async () => {
  const testClient = await superoak(app);
  await testClient.get("/").expect(200);
});
