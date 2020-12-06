import { Application, oakCors } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from "./middlewares/middlewares.js";
import { adapterFactory, engineFactory, Session, viewEngine } from "./deps.js";

const port = 7777;

// init oak application
const app = new Application();

// start logging requests and errors
app.use(middleware.errorLoggingMiddleware);
app.use(middleware.requestLoggingMiddleware);

// use session to manage user sessions
const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

// allow cross-origin requests to the api (all paths actually)
app.use(oakCors());

// setup  session based authentication
app.use(middleware.limitAccessMiddleware);

// setup serving static files
app.use(middleware.serveStaticFilesMiddleware);

// handle .ejs templating
const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(
  viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views",
  }),
);

// add routes
app.use(router.routes());

// start serving!
console.log(`serving at port ${port}`);
app.listen({ port });

// export for app for testing
export default app;
