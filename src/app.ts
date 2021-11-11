import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import * as uuid from 'node-uuid';
const hpp = require('hpp');
import MongoStore from 'connect-mongo';
import mongoSanitize from 'express-mongo-sanitize' // for nosql injection
import lusca from "lusca"; //Web application security middleware.

import { userRoutes } from './routes/user/user.API';
import morganMiddleware from './middlewares/morgan/morganMiddleware';
import { errorHandler } from './middlewares/handler/error-handler';
import { NotFoundError } from './errors/not-found-error';

import keys from './config';

// import { InternalServerError } from './errors/interal-server-error';

import csurf from 'csurf';
import csrfCookieSetter from './utils/csrf';

// import swaggerUi from "swagger-ui-express";
// import SwaggerDoc from "./config/documentation";



// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public app: express.Application;

  private corsOptions: cors.CorsOptions = {
    credentials: true,
    origin: keys.ORIGIN_CORS,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'origin',
      'Access-Control-Allow-Headers',
    ],
    optionsSuccessStatus: 204,
    preflightContinue: false,
    exposedHeaders: ["set-cookie"]
  };

  private sessionOptions: session.SessionOptions = {
    name: 'user_session', // session_name
    secret: keys.SESSION_SECRET, // secret to sign data
    resave: false, // resave in DB when expired?
    saveUninitialized: false, // save token if not have data
    genid: (req: Request) => {
      // use UUIDs for session IDs
      return uuid.v4();
    },
    proxy: true, // The "X-Forwarded-Proto" header will be used.
    // Add HTTPOnly, Secure attributes on Session Cookie
    // If secure is set, and you access your site over HTTP, the cookie will not be set
    cookie: {
      httpOnly: true, // when setting this to true, as compliant clients will not allow client-side JavaScript to see the cookie in document.cookie
      signed: true,
      sameSite: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,  // default 1 * 24 * 60 * 60 * 1000, // Cookie expires after 1 day(about a semester)
      secure: process.env.NODE_ENV === 'production', //If true, this cookie may only dilivered while https
    },
    rolling: true,
    //mongo
    store: MongoStore.create({
      mongoUrl: keys.MONGODB_URI,
      ttl: 1 * 24 * 60 * 60, // time to live = 1 day
      collectionName: 'express_session',
      autoRemove: 'interval', // remove expired sessions
      autoRemoveInterval: 24 * 60,  // Interval (in minutes) used when autoRemove option is set to interval.
      crypto: {
        secret: keys.SESSION_SECRET,
      },
      stringify: true,
    }),

    // ***** redis *****
    // import connectRedis from 'connect-redis';
    // private RedisStore = connectRedis(session);

    // store: new this.RedisStore({
    //     client: RedisManager.client.client,
    //     disableTouch: true,
    //  }),
  };

  //Run configuration methods on the Express instance.
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
    // this.clinet();
    this.errorsHandler();
  }

  // Configure Express middleware.
  private middleware(): void {
    // TODO: Proxy
    this.setupProxy();

    // TODO: Helmet headers
    this.setupHelmet();

    /**
     * TODO: Use gzip compression
     */
    this.app.use(compression());

    // TODO: setup cors policy
    this.app.use(cors(this.corsOptions))

    // TODO: Express json parser
    this.setupExpressJsonParser();

    // TODO: Session
    this.setupSession();

    // TODO: Lusca security headers
    this.setLuscaSecurityMiddlewares();


    // TODO: CSRF
    // this.setupCsrf();

    // Pretty API Responses
    this.app.set('json spaces', 4)

    // TODO: Log to file when running on production
    this.app.use(morganMiddleware);

    // TODO: MongoSanitize
    // Data sanitization against NoSQL Query injection
    this.app.use(mongoSanitize()) // prevent from NoSQL injection like (email:{"$gt":""}) in body

  }

  /**
   * Setup for get IP, for reverse proxy
   * Turn on View Caching
   */
  private setupProxy(): void {
    // TODO: Setup for get IP, for reverse proxy

    this.app.set("trust proxy", true);
    /* Turn on View Caching */
    this.app.set('view cache', true);
  }

  /**
   * parses json 
   * parses urlencoded bodies
   */
  private setupExpressJsonParser() {
    // parses json and only looks at requests
    // where the Content-Type header matches the type optio
    this.app.use(express.json());
    // Returns middleware that only parses urlencoded bodies and only looks at requests
    // where the Content-Type header matches the type option
    // parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
    this.app.use(express.urlencoded({ extended: false }));
  }

  /** 
   * Security headers
  */
  private setupHelmet(): void {
    /**
     * todo: setup helmet
     * Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
     * Helmet is actually just a collection of smaller middleware functions that set security-related HTTP response headers:
    */

    this.app.use(
      helmet.contentSecurityPolicy({
        directives: {
          "default-src": ["'self'"],
          "base-uri": ["'self'"],
          "block-all-mixed-content": [],
          "font-src": ["'self'", "https:", "data:"],
          "frame-ancestors": ["'self'"],
          "img-src": ["'self'", "https:", "data:"],
          "object-src": ["'none'"],
          "script-src": ["'self'", "'unsafe-inline'"],
          "script-src-attr": ["'none'"],
          "style-src": ["'self'", "https:", "'unsafe-inline'"],
          "upgrade-insecure-requests": []
        },
      })
    );

    /* Prevent XSS Attacks */
    this.app.use(helmet.xssFilter());
    /* Prevents click jacking */
    this.app.use(helmet.frameguard({ action: 'deny' }));
    /* Enforces users to use HTTPS (requires HTTPS/TLS/SSL) */
    // app.use(helmet.hsts({ maxAge: process.env.APP_HTTPS_TIMEOUT }));
    /* Hides x-powered-by header */
    this.app.use(helmet.hidePoweredBy());
    /* Prevent MIME type sniffing */
    this.app.use(helmet.noSniff());
    // Sets "X-Download-Options: no-open"
    this.app.use(helmet.ieNoOpen())
    /* Prevent Parameter Pollution */
    this.app.use(hpp());
    this.app.use(helmet.hsts())
  }

  private setupSession(): void {
    this.app.use(cookieParser('hello-sherif'));

    // Create a session middleware with the given options
    // Note session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
    // Options: resave: forces the session to be saved back to the session store, even if the session was never
    //                  modified during the request. Depending on your store this may be necessary, but it can also
    //                  create race conditions where a client has two parallel requests to your server and changes made
    //                  to the session in one request may get overwritten when the other request ends, even if it made no
    //                  changes(this behavior also depends on what store you're using).
    //          saveUnitialized: Forces a session that is uninitialized to be saved to the store. A session is uninitialized when
    //                  it is new but not modified. Choosing false is useful for implementing login sessions, reducing server storage
    //                  usage, or complying with laws that require permission before setting a cookie. Choosing false will also help with
    //                  race conditions where a client makes multiple parallel requests without a session
    //          secret: This is the secret used to sign the session ID cookie.
    //          name: The name of the session ID cookie to set in the response (and read from in the request).
    //          cookie: Please note that secure: true is a recommended option.
    //                  However, it requires an https-enabled website, i.e., HTTPS is necessary for secure cookies.
    //                  If secure is set, and you access your site over HTTP, the cookie will not be set.

    this.app.use(session(this.sessionOptions));

  }

  private setLuscaSecurityMiddlewares(): void {
    // this.app.use(lusca.csrf());
    // Enables X-FRAME-OPTIONS headers to help prevent Clickjacking.
    this.app.use(lusca.xframe("SAMEORIGIN"));
    this.app.use(lusca.xssProtection(true));
    this.app.use(lusca.nosniff());
    //Enables Referrer-Policy header to control the Referer header.
    this.app.use(lusca.referrerPolicy('same-origin'));

    // Everything but images can only come from own domain (excluding subdomains)
    // this.app.use(lusca.csp({
    //   policy: {
    //     'default-src': '\'self\'',
    //     'img-src': '*'
    //   }
    // }));
  }

  private swaggerAPI(): void {
    // if (process.env.NODE_ENV === "development") {
    //   this.app.use('/docs', swaggerUi.serve, SwaggerDoc.getSwaggerSetup());
    // }
  }

  private setupCsrf(): void {
    // add CSRF token to our requests (to bypass midm, csrf attacks)
    const csurfCookieOptions: csurf.CookieOptions = {
      signed: true,
      httpOnly: true
    };

    const csrfTokenOptions: csurf.CookieOptions = {};

    if (process.env.NODE_ENV !== 'development') {
      csurfCookieOptions.secure = true;
      csurfCookieOptions.sameSite = 'strict';
      csrfTokenOptions.secure = true;
      csrfTokenOptions.sameSite = 'strict';
    }

    // this.app.use(csurf({ cookie: csurfCookieOptions }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler

    this.app.get('/', (req, res) => {
      res.send('The sedulous hyena ate the antelope!');
    });

    this.app.use('/api/v0', userRoutes);
  }

  private clinet(): void {
    this.app.get('*', (req: Request, res: Response) => {
      this.app.use(csrfCookieSetter());
      // res.sendFile(path.join(config.UI_BUILD_PATH, '/index.html'));
    });

  }

  private errorsHandler(): void {
    this.app.all('*', async (req, res) => {
      throw new NotFoundError();
    });

    this.app.use(errorHandler);
  }
}

export default new App().app;