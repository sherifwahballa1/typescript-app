import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { userRoutes } from './routes/user.API';
import morganMiddleware from './middlewares/morganMiddleware';
import { errorHandler } from './middlewares/handler/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { InternalServerError } from './errors/interal-server-error';



// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public app: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.app.set('trust proxy', true);
    this.app.use(express.json());
    this.app.use(cookieSession({
      signed: false,
      secure: process.env.NODE_ENV !== 'test'
    }));
    this.app.use(morganMiddleware);

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

    // Capture 500 errors
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      throw new InternalServerError({ ip: req.ip, statusMessage: res.statusMessage, message: err.message, method: req.method, originalUrl: req.originalUrl })
    })

    this.app.all('*', async (req, res) => {
      throw new NotFoundError();
    });

    this.app.use(errorHandler);
  }

}

export default new App().app;