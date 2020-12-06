import { format, send } from "../deps.js";
import { getUserId } from "../services/sessionService.js";

const errorLoggingMiddleware = async (context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
};

const TESTING = Deno.env.get("TESTING");

const requestLoggingMiddleware = async ({ request, session }, next) => {
  const start = Date.now();
  await next();

  // log only if not running tests
  if (!TESTING) {
    const ms = Date.now() - start;
    const userId = await getUserId(session);
    console.log(
      `%c${
        userId ? userId : "anonymous"
      }: %c${request.method} %c${request.url.pathname}${request.url.search} %c${
        format(
          new Date(),
          "yyyy-MM-dd hh:mm",
        )
      } %c- %c${ms} ms`,
      "color:grey",
      "color:cyan",
      "color:magenta",
      "color:yellow",
      "color:white",
      "color:red",
    );
  }
};

const limitAccessMiddleware = async ({ request, response, session }, next) => {
  /*
   * allow access only if:
   * - authenticated
   * - accessing "/auth/"
   * - accessing "/api/"
   * else redirect to "/auth/register"
   */
  if (
    (await session.get("authenticated")) ||
    request.url.pathname.startsWith("/auth/") ||
    request.url.pathname.startsWith("/api/")
  ) {
    await next();
  } else {
    response.redirect("/auth/login");
  }
};

const serveStaticFilesMiddleware = async (context, next) => {
  if (context.request.url.pathname.startsWith("/static")) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`,
    });
  } else {
    await next();
  }
};

export {
  errorLoggingMiddleware,
  limitAccessMiddleware,
  requestLoggingMiddleware,
  serveStaticFilesMiddleware,
};
