import { Socket, Server, Namespace } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import keys from '../config';
import { RedisClient } from 'redis';
import RedisManager from '../core/connections/redis/RedisManager';
import Log from '../utils/Log';
import jwt from 'jsonwebtoken';

/**
 * Provides access to the Socket server via the singleton.
 */
export default class SocketManager {
  public static get client(): SocketSingleton | undefined {
    return SocketSingleton.getInstance();
  }

  public static closeConnection(): void {
    SocketSingleton.getInstance().stop();
  }
}

type TNamespace = {
  test: string;
  user: string;
};

class SocketSingleton {

  private io: Server | any;
  private static _instance: SocketSingleton;
  names: TNamespace = { test: "/test", user: "/sherif" };
  namespace: Namespace;
  static pubClient: RedisClient;
  static subClient: RedisClient;
  socket: Socket;
  adapter: any;

  constructor() {
    this.io = this.setSocketConfigurations();

    // TODO: setup nsp
    this.namespace = this.getNamespace();

    // TODO: The errors emitted from pubClient and subClient will also be forwarded to the adapter instance:
    this.getNamespace().adapter.on("error", (error: any) => {
      console.log(error);
    });

    // TODO: setup middleware handshake
    // this.setMiddleware(async (socket: Socket | any, next: any) => {
    //   try {
    //     if (socket.handshake.auth && socket.handshake.auth.token) {
    //       if (this.verifySocket(socket.handshake.auth.token)) {
    //         next();
    //       } else {
    //         return next(new Error("Not Authentication Please try to login again"));
    //       }
    //     } else {
    //       return next(new Error("Not Authentication Please try to login again 1"));
    //     }
    //   } catch (error: any) {

    //     socket.disconnect(true);
    //     this.stop();
    //     return next(new Error("Not Authentication Please try to login again 2"));

    //   }
    // });

    // TODO: setup socket
    this.socket = this.getSocket();

    this.adapter = this.client?.adapter;

    Log.info(`Server socket.io on port ${keys.WS_PORT}`);
  }

  setSocketConfigurations(): Server {
    let io = new Server(keys.WS_PORT, {
      path: "/ws/",
      cors: {
        origin: ["http://localhost:4200"],
        methods: ["GET", "POST"],
        credentials: true,
        optionsSuccessStatus: 200
      },
      serveClient: false,
      // transports: ['websocket'],
      connectTimeout: 0
    });

    SocketSingleton.pubClient = RedisManager.client.client;
    SocketSingleton.subClient = SocketSingleton.pubClient.duplicate();

    // TODO: setup adapter
    io.adapter(createAdapter(SocketSingleton.pubClient, SocketSingleton.subClient));

    return io;
  }

  // TODO: setup nsp
  //  this.namespace = this.io.of(this.names.user);
  getNamespace(namespace: string = this.names.user): Namespace | any {
    const nsp = this.namespace;
    if (nsp) {
      return this.namespace;
    }
    this.namespace = this.io.of(namespace);
    return this.namespace;
  }


  verifySocket(token: any): any {
    return jwt.verify(token, `12332434434`);
  }

  getSocket(listenName: string = "connection"): Socket {
    const ws = this.socket;
    if (ws) {
      return this.socket;
    }

    return this.getNamespace().on(listenName, (socket: Socket) => {
      this.socket = socket;
      this.initEvents();
      return this.socket;
    });
  }


  public static getInstance(): SocketSingleton {
    if (!SocketSingleton._instance) {
      SocketSingleton._instance = new SocketSingleton();
    }

    return SocketSingleton._instance;
  }

  public get client(): Server | undefined {
    return this.io;
  }

  subEvent(eventName: string): void {
    SocketSingleton.subClient?.subscribe(eventName);
  }

  pubEvent(eventName: string, data: any): void {
    SocketSingleton.pubClient?.publish(eventName, data);
  }

  setMiddleware(callback: any): void {
    this.namespace.use((socket: Socket, next: any) => {
      callback(socket, next);
    });
  }

  onListenEvent(eventName: string, callback: any): void {
    if (!this.socket) {
      this.socket = this.getSocket();
    }

    this.socket.on(eventName, function (arg: any) {
      callback(arg, callback);
    });
  }

  // sending to the client
  emitEvent(eventName: string, data: JSON | Object): void {
    try {
      this.getSocket()?.emit(eventName, data);
    } catch (error) {
      this.getSocket()?.emit(eventName, error);
    }
  }

  broadcastEmitEvent(eventName: string, data: JSON | Object): void {
    try {
      this.getNamespace().emit(eventName, data);
    } catch (error) {
      this.io.broadcast?.emit(eventName, error);
    }
  }

  private initEvents() {
    this.socket.once('joinRequest', (room: any) => {
      console.log("join to Room :", room);
    });

    this.socket.on('update', (data: any) => {
      console.log('HI from', data);
    })

  }

  public stop() {
    SocketSingleton.pubClient?.quit();
    SocketSingleton.subClient?.quit();
    this.io?.close();
  }

}