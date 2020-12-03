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
    `${request.method} ${request.url.pathname}${request.url.search} - ${ms} ms`
  );
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
  requestLoggingMiddleware,
  serveStaticFilesMiddleware,
};
