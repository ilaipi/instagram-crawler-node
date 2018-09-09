/**
 * instagram user to crawl
 */
module.exports = function (Schema) {
  const ProviderSchema = new Schema({
    username: {
      type: String,
      comment: 'user instagram id'
    },
    status: {
      type: String,
      enum: [
        'normal', // need to crawl
        'pause' // don't need to crawl
      ]
    }
  });
  return ['Provider', ProviderSchema];
};
