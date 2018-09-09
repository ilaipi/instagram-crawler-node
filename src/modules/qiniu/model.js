/**
 * media
 */
module.exports = function (Schema) {
  const MediaSchema = new Schema({
    name: {
      type: String,
      comment: '原始文件名' // 文件原始名称，不能用于保存在七牛端的key
    },
    key: {
      type: String,
      comment: '云端文件的key值' // 保存云端七牛文件的key值，用来取文件
    },
    bucket: {
      type: String,
      comment: '保存空间' // 七牛端空间名
    },
    size: {
      type: Number,
      comment: '文件大小',
      remark: '单位：bytes'
    },
    readableSize: {
      type: String,
      comment: '文件大小',
      remark: 'e.g. 1 KB 1 MB'
    },
    hash: {
      type: String,
      comment: '内容hash',
      remark: 'hash值相同的只上传一次'
    },
    type: {
      type: String,
      comment: '文件后缀'
    },
    source: {
      type: String,
      comment: '原始链接',
      remark: '用于从外部copy的图片，其原始地址'
    }
  });
  return ['Media', MediaSchema];
};
