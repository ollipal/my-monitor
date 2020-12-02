import { Application } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from "./middlewares/middlewares.js";
import { viewEngine, engineFactory, adapterFactory, Session } from "./deps.js";

// init oak application
const app = new Application();

// start logging requests and errors
app.use(middleware.errorLoggingMiddleware);
app.use(middleware.requestLoggingMiddleware);

// setup serving static files
app.use(middleware.serveStaticFilesMiddleware);

// use session to manage user sessions
const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

// handle .ejs templating
const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(
  viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views",
  })
);

// add routes
app.use(router.routes());

// start serving!
app.listen({ port: 7777 });

// export for app for testing
export default app;
