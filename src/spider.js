import moment from 'moment';
import { keys } from 'lodash';

import mongo from './common/mongo/';

import spiders from './modules/spider/';
import logger from './modules/util/log';
import config from './modules/util/config';
import { createClient } from './modules/util/service';

/**
 * 循环执行本层任务，每次从redis中取出一个任务，调用对应的爬虫方法
 */
const crawl = async spider => {
  const client = await createClient();
  do {
    let task = await client.lpopAsync(`${spider}_tasks`);
    if (!task) {
      logger.info({ spider }, '任务已执行完成');
      break;
    }
    task = JSON.parse(task);
    try {
      await spiders[spider].crawler(task);
    } catch (err) {
      logger.warn({ err, task, spider }, '顶层调度捕捉到爬虫执行异常，继续执行下层爬虫');
    }
  } while (true);
};

const bootstrap = async () => {
  const uid = `${process.pid}_${Date.now()}`;
  const client = await createClient();
  const day = moment().format('YYYY-MM-DD');
  const key = `spider_processes_${day}`;
  await client.hsetAsync(key, uid, JSON.stringify({
    uid,
    pid: process.pid,
    status: 'running'
  }));
  for (let l = 1; l <= keys(spiders).length; l++) {
    logger.info(`开始执行第${l}层任务`);
    await crawl(`level_${l}`);
    logger.info(`第${l}层任务执行完成`);
  }
  const spider = await client.hgetAsync(key, uid);
  await client.hsetAsync(key, uid, JSON.stringify({ ...JSON.parse(spider), status: 'done' }));
};

mongo(config).then(async () => {
  try {
    await bootstrap();
    logger.info('爬虫任务全部执行完成，程序退出');
    process.exit(0);
  } catch (err) {
    logger.warn({ err }, '启动方法捕捉到执行异常');
  }
});
