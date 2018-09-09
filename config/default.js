module.exports = {
  app: {
    name: 'instagram-crawler'
  },
  cache: {
    redis: {
      db: 0,
      ttl: 1800
    },
    memory: {
      max: 100,
      ttl: 600
    }
  }
};
