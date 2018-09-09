/**
 * user post
 */
module.exports = function (Schema) {
  const ProviderPostSchema = new Schema({
    social: {
      type: String
    },
    type: {
      type: String,
      comment: '类型'
    },
    media: {
      type: [Schema.Types.Mixed],
      comment: '照片/视频',
      definition: {
        type: 'video/img',
        url: '七牛链接', // 这里不再保存原始链接。在media中保存原始链接。存的是media.id
        thumb: '封面图的原始链接' // 如果是视频，则有值。存的是media.id
      }
    },
    date: {
      type: Date,
      comment: '发布时间'
    },
    uri: {
      type: String,
      comment: '访问地址',
      remark: '唯一值'
    },
    text: {
      type: String,
      comment: '原文',
      remark: '可能为空，比如转推的时候没有写内容'
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      comment: '发布者'
    }
  });
  return ['ProviderPost', ProviderPostSchema];
};
