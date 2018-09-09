import glob from 'glob';
import path from 'path';

const spiders = () => {
  const defines = glob.sync('*.js', {
    root: './levels/',
    cwd: path.resolve(__dirname, 'levels')
  });
  const spiders = {};
  for (let def of defines) {
    const crawler = require('./levels/' + def);
    spiders[`level_${crawler.level}`] = crawler;
  }
  return spiders;
};

export default spiders();
