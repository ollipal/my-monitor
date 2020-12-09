export {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v6.3.2/mod.ts";
export {
  adapterFactory,
  engineFactory,
  viewEngine,
} from "https://deno.land/x/view_engine@v1.4.5/mod.ts";
export { Pool } from "https://deno.land/x/postgres@v0.4.5/mod.ts";
export { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";
export {
  format,
  weekOfYear,
} from "https://deno.land/std@0.67.0/datetime/mod.ts";
export { compare, hash } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
export { oakCors } from "https://deno.land/x/cors@v1.2.1/mod.ts";
export { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
export {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.78.0/testing/asserts.ts";
export {
  isEmail,
  minLength,
  required,
  validate,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

// export the environmental values
import { config } from "https://deno.land/x/dotenv@v1.0.1/mod.ts";
if (!Deno.env.get("HEROKU_PORT")) {
  config({
    path: "./config/.env",
    example: "./config/.env.example",
    safe: true,
    export: true,
  });
}
