import mongo from './common/mongo/';
import config from './modules/util/config';
import crawler from './modules/crawler/';

const crawl = async () => {
  await mongo(config);
  await crawler('kingljames');
  process.exit(0);
};

crawl();
