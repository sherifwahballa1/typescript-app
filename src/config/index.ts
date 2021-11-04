import { Keys } from "../interfaces/Keys";

let keys: Keys;

keys = process.env.NODE_ENV === 'production' ? require('./prod') : require('./dev');

export default keys;