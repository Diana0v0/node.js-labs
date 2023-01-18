import * as http from "node:http";
import router from "./router.js";
import defaultHandler from "./defaultHandler.js";
import helpers from "./helpers.js";
import { safeJSON } from "./utils.js";

const processedContentTypes = {
  "text/html": (text) => text,
  "text/plain": (text) => text,
  "application/xml": (text) => text,
  "application/json": (json) => safeJSON(json, {}),
  "multipart/form-data": (formData) => {
    return Object.fromEntries(new URLSearchParams(formData));
  },
  "application/x-www-form-urlencoded": (data) => {
    return Object.fromEntries(new URLSearchParams(data));
  },
};

const connections = new Map();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `https://${req.headers.host}`);
  const routerModule = router.get(url.pathname) ?? {};
  const handler = routerModule[req?.method] ?? defaultHandler;

  connections.set(res.connection, res);

  let payload = {};
  let rawRequest = "";

  for await (const chunk of req) {
    rawRequest += chunk;
  }

  if (req.headers["content-type"]) {
    const contentType = req.headers["content-type"].split(";")[0];
    if (processedContentTypes[contentType]) {
      payload = processedContentTypes[contentType](rawRequest);
    }
  }

  try {
    handler(req, Object.assign(res, helpers), url, payload, rawRequest);
  } catch (e) {
    res.statusCode = 500;
    res.end(process.env.NODE_ENV === "production" ? "internal error" : e);
  }
});

// eslint-disable-next-line n/handle-callback-err
server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 bad request\r\n\r\n");
});

server.on("connection", (connection) => {
  console.log("New connection");
  connection.on("close", () => {
    console.log("Close connection");
    connections.delete(connection);
  });
});

server.listen(parseInt(process.env.PORT) || 8000);

const showConnections = () => {
  console.log("Connection:", [...connections.values()].length);
  for (const connection of connections.keys()) {
    const { remoteAddress, remotePort } = connection;
    console.log(` ${remoteAddress}:${remotePort}`);
  }
};

const closeConnections = () => {
  for (const [connection, res] of connections.entries()) {
    connections.delete(connection);
    res.end("Server stopped");
    connection.destroy();
  }
};

const freeResources = async () => {
  console.log("Free resources");
};

const gracefulShutdown = async () => {
  server.close((error) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
  });
  await freeResources();
  await closeConnections();
};

process.on("SIGINT", async () => {
  console.log();
  console.log("Graceful shutdown");
  showConnections();
  await gracefulShutdown();
  showConnections();
  console.log("Server closed");
  process.exit(0);
});
