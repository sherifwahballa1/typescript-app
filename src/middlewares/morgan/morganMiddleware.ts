import morgan, { StreamOptions } from "morgan";

import Logger from "../../utils/Logger";

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: (message) => {
    if (message.includes('/'))
      Logger.http(message.replace(/\n$/, ''));
  }
};

// Skip all the Morgan http log if the 
// application is not running in development mode.
// This method is not really needed here since 
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};


// Build the morgan middleware
let morganMiddleware: any;

if (process.env.NODE_ENV === 'production') {
  morganMiddleware = morgan(
    // Define message format string (this is the default one).
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // You can create your custom token to show what do you want from a request.
    'IP: :remote-addr - "Method: :method - API: :url HTTP/:http-version" - STATUS: :status ==== "BROWSER: :user-agent ==== Response-time: :response-time ms',
    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream, skip }
  );
} else {
  morganMiddleware = morgan('tiny', { stream, skip });
}

export default morganMiddleware;

