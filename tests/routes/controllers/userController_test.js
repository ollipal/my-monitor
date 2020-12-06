import app from "../../../app.js";
import { superoak } from "../../../deps.js";

Deno.test("GET to /auth/register renders (returns 200)", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/register").expect(200);
});

Deno.test("GET to /auth/login renders (returns 200)", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/login").expect(200);
});
