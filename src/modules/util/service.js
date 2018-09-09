import Promise from 'bluebird';
import redis from 'redis';

import config from './config';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

let redisClient;

const createClient = async () => {
  if (redisClient) return redisClient;
  redisClient = await redis.createClient(config.redis);
  return redisClient;
};

export const name = 'helper';

export { createClient };
