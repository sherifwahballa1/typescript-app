import mongoose from 'mongoose';
import keys from '../../../config';
import Log from '../../../utils/Log';
import Logger from '../../../utils/Logger';

/**
 * Provides access to the redis client via the singleton.
 */
export default class MongoManager {
  public static get client(): mongoose.Mongoose | undefined {
    return MongoSingleton.getInstance().client;
  }

  public static closeConnection(): void {
    mongoose.connection.close(false, () => {
      Log.warn('MongoDb connection closed!')
      // Exit from process
      process.exit(0);
    });
  }
}

class MongoSingleton {

  private static _instance: MongoSingleton;
  private _client: mongoose.Mongoose | undefined;
  constructor() {
    this.connect();
    this.connectionStatus();
  }

  public async connect(): Promise<mongoose.Mongoose | undefined> {
    try {
      this._client = await mongoose.connect(`${keys.MONGODB_URI}`);
      return this._client;
    } catch (err: any) {
      Logger.error(
        `[ Database =>] The connection to the database failed: ${err.message}. = ${keys.MONGODB_URI} ❌`
      )
    }
  }

  public static getInstance(): MongoSingleton {
    if (!MongoSingleton._instance) {
      MongoSingleton._instance = new MongoSingleton();
    }

    return MongoSingleton._instance;
  }

  public connectionStatus() {
    mongoose.connection.on('connecting', function () {
      Logger[`${process.env.NODE_ENV === 'production' ? 'warn' : 'debug'}`](
        `[ Database =>] Trying to Connection to the database. ${process.env.MONGODB_URI} ✅`
      );
    })

    mongoose.connection.on('error', function (err: Error) {
      Logger.error(
        `[ Database =>] The connection to the database failed: ${err.message}. = ${process.env.MONGODB_URI} ❌`
      )
    });

    mongoose.connection.on('disconnected', function () {
      Logger[`${process.env.NODE_ENV === 'production' ? 'warn' : 'debug'}`](
        `[ Database =>] Mongoose default connection is disconnected.`
      );
      Log.error('Mongoose default connection is disconnected!')
    });

    mongoose.connection.on('connected', function () {
      Log.info('MongoDB connected successfully now!')
    });
  }

  public get client(): mongoose.Mongoose | undefined {
    return this._client;
  }

}