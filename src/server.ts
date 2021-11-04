import http from 'http';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/env/.env' });
import 'colors';
import https from 'https';
import fs from 'fs';

import Log from './utils/Log';
import Logger from './utils/Logger';
import "./services/cache";
import keys from './config';

import app from './app'
import { mongoConnection, closeMongoConnection } from './utils/mongo-connection';
import { socketConnection } from './utils/socket-connection';

const options = {
  key: fs.readFileSync(`${__dirname}/core/keys/key.pem`),
  cert: fs.readFileSync(`${__dirname}/core/keys/cert.pem`)
};

const PORT = normalizePort(`${keys.port}`);
app.set('port', PORT);

const start = async () => {
  await mongoConnection();
  socketConnection();

  Log.info(`
  ︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵ⓈⒽⒺⓇⓘⒻ︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵
  ︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵♕♕♕︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵︵
  ﹝﹝ ☠  ╔═══𝓼════╗  ╔══╗          ╔════════╗ ╔═════════╗     ╔══╗   ╔═════════╗ ☠ ﹞﹞
  ﹝﹝ ☠  ║▓▓╔═════╝  ║▓▓║          ║▓▓╔═════╝ ║▓▓ ╔══╗▓▓╚═╗   ╚══╝   ║▓▓╔══════╝ ☠ ﹞﹞
  ﹝﹝ ☠  ║▓▓║        ║▓▓║          ║▓▓║       ║▓▓ ╚══╝▓▓╔═╝   ╔══╗   ║▓▓║        ☠ ﹞﹞
  ﹝﹝ ☠  ║▓▓╚═════╗  ║▓▓║          ║▓▓╚════╗  ║ ╔═╗ ╔═══╝     ║▓▓║   ║▓▓╚════╗   ☠ ﹞﹞
  ﹝﹝ ☠  ╚═════╗▓▓║  ║▓▓╚═══════╗  ║▓▓╔════╝  ║ ║  ⑊ ⑊        ║▓▓║   ║▓▓╔════╝   ☠ ﹞﹞
  ﹝﹝ ☠        ║▓▓║  ║▓▓╔════╗▓▓║  ║▓▓║       ║ ║   ⑊ ⑊       ║▓▓║   ║▓▓║        ☠ ﹞﹞
  ﹝﹝ ☠        ║▓▓║  ║▓▓║    ║▓▓║  ║▓▓║       ║ ║    ⑊  ⑊     ║▓▓║   ║▓▓║        ☠ ﹞﹞
  ﹝﹝ ☠  ╔═════╝▓▓║  ║▓▓║    ║▓▓║  ║▓▓╚════╗  ║ ║     ⑊  ⑊    ║▓▓║   ║▓▓║        ☠ ﹞﹞
  ﹝﹝ ☠  ╚════════╝  ╚══╝    ╚══╝  ╚═══════╝  ╚═╝     ╚══╝    ╚══╝   ╚══╝        ☠ ﹞﹞
  ︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶
  ︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶︶
  `)

}

let server: any;
// ======== https ==========
if (process.env.NODE_ENV === 'production') {
  server = https.createServer(options, app).listen(PORT, async () => {
    Log.info(`Current Environment:  ----- ${process.env.NODE_ENV} ----- :  https`)




    await start();
  });
} else {
  server = http.createServer(app).listen(PORT, async () => {
    Log.info(`Current Environment:  ----- ${process.env.NODE_ENV} ----- :  http`)
    await start();
  });
}

server.on("error", onError);
server.on("listening", onListening);

// Graceful shutdown means when all your requests to the server is respond and not any data processing work left.
// The SIGTERM signal is a generic signal used to cause program termination. Unlike SIGKILL, this signal can be blocked, handled, and ignored. It is the normal way to politely ask a program to terminate
process.on("SIGTERM", gracefulShutdown);

// 'SIGINT' generated with <Ctrl>+C in the terminal.
process.on("SIGINT", gracefulShutdown);

process.on("exit", (code) => {
  Log.warn(`"Process exit event with code: ", ${code}`)
});

function gracefulShutdown() {
  // Handle process kill signal
  // Stop new requests from client
  // Close all data process
  // Exit from process

  // Handle process kill signal
  Log.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
  Log.warn("Closing http server.")

  // Stop new requests from client
  server.close(() => {
    Log.warn("👋 Http server closed.");
    closeMongoConnection();
  });
}

function normalizePort(val: string) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      Log.error(`${bind} requires elevated privileges ❌`)
      Logger.error(error);
      // process.exit(1);
      break;
    case "EADDRINUSE":
      Log.error(`${bind} is already in use ❌`)
      Logger.error(error);
      // process.exit(1);
      break;
    default:
      Logger.error(error);
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  Log.info(`################## running on ${bind}`)
}

export default server;
