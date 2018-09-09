import mongoose from 'mongoose';

import mongo from './common/mongo/';

import logger from './modules/util/log';
import config from './modules/util/config';
import { createClient } from './modules/util/service';

mongo(config).then(async () => {
  const client = await createClient();
  const Provider = mongoose.model('Provider');
  const providers = await Provider.find({ status: 'normal' });
  // 每次开始时，清空redis
  await client.flushallAsync();
  for (const provider of providers) {
    await client.rpushAsync('level_1_tasks', JSON.stringify(provider.toJSON()));
  }
  logger.info('爬虫任务调度完成，调度程序退出');
  process.exit(0);
});
