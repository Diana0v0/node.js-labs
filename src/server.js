import * as http from "node:http";
import router from "./router.js";
import defaultHandler from "./defaultHandler.js";
import helpers from "./helpers.js";

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `https://${req.headers.host}`);
  const routerModule = router.get(url.pathname) ?? {};
  const handler = routerModule[req?.method] ?? defaultHandler;
  handler(req, Object.assign(res, helpers), url);
});

// eslint-disable-next-line n/handle-callback-err
server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 bad request\r\n\r\n");
});
server.listen(parseInt(process.env.PORT) || 8000);

process.on("SIGINT", () => {
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });
});
