/**
 * this script can be used for test entrance
 * @deprecated
 * @see ./scheduler.js
 * @see ./spider.js
 */
import mongo from './common/mongo/';
import config from './modules/util/config';
import crawler from './modules/spider/crawler';

const crawl = async () => {
  await mongo(config);
  await crawler('kingljames');
  process.exit(0);
};

crawl();
