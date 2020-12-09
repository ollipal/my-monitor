web: HEROKU_PORT=${PORT} deno run --allow-read --allow-net --allow-env --unstable app.js

// why --allow-new:${PORT} fails???? (or wht tries to access port 5432) 
// 2020-12-09T07:48:00.175008+00:00 app[web.1]: error: Uncaught (in promise) PermissionDenied: network access to "ec2-52-31-233-101.eu-west-1.compute.amazonaws.com:5432", run again with the --allow-net flag
// 2020-12-09T07:48:00.175010+00:00 app[web.1]: at processResponse (core.js:226:13)
// 2020-12-09T07:48:00.175011+00:00 app[web.1]: at Object.jsonOpAsync (core.js:244:12)
// 2020-12-09T07:48:00.175012+00:00 app[web.1]: at async Object.connect (deno:cli/rt/30_net.js:224:13)
// 2020-12-09T07:48:00.175013+00:00 app[web.1]: at async Connection.startup (connection.ts:143:17)
// 2020-12-09T07:48:00.175013+00:00 app[web.1]: at async Pool._createConnection (pool.ts:32:5)
// 2020-12-09T07:48:00.175013+00:00 app[web.1]: at async pool.ts:61:7
// 2020-12-09T07:48:00.175014+00:00 app[web.1]: at async Promise.all (index 0)
// 2020-12-09T07:48:00.175015+00:00 app[web.1]: at async Pool._startup (pool.ts:63:25)
// 2020-12-09T07:48:00.230270+00:00 heroku[web.1]: Process exited with status 1