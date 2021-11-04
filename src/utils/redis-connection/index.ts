import RedisManager from '../../core/connections/redis/RedisManager';

export const redisConnection = () => {
  RedisManager.client;
};