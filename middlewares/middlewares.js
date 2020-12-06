import { send } from "../deps.js";

const errorLoggingMiddleware = async (context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
};

const requestLoggingMiddleware = async ({ request }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(
    `${request.method} ${request.url.pathname}${request.url.search} - ${ms} ms`,
  );
};

const limitAccessMiddleware = async ({ request, response, session }, next) => {
  // allow access to login page without being authenticated
  if (
    request.url.pathname === "/auth/login" ||
    request.url.pathname.startsWith("/api/")
  ) {
    await next();
    // if requesting the landing page and not authenticated, redirect to login
  } else if (
    request.url.pathname === "/" &&
    !(await session.get("authenticated"))
  ) {
    response.redirect("/auth/login");
    // everything else should be accessed only if authenticated
  } else if (await session.get("authenticated")) {
    await next();
  } else {
    response.status = 401;
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
