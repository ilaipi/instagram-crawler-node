import path from 'path';

import mongoose from 'mongoose';
import moment from 'moment';
import md5Buffer from 'md5-hex';

import { get } from '../request';
import { uploadFile } from '../../qiniu/service';

/**
 * 把原地址文件下载下来，上传到七牛去
 * @param { String } uri 原地址
 * @param { String } bucket 七牛空间
 * @return { String } 七牛地址
 */
const transfer2Qiniu = async ({ uri, bucket }) => {
  const { data: buffer } = await get(uri, {}, { responseType: 'arraybuffer' });
  const hash = await md5Buffer(buffer);
  const Media = mongoose.model('Media');
  const media = await Media.findOne({ hash });
  if (media) return media.id;
  const name = path.basename(uri);
  const res = await uploadFile({
    name,
    buffer,
    key: `${moment().format('YYYYMMDD_HHmmssSSS')}-${name}`,
    bucket
  });
  const _id = mongoose.Types.ObjectId();
  if (!res.err) {
    await Media.create({
      _id,
      hash,
      source: uri,
      ...res
    });
  }
  return _id;
};

const getBucket = (username, social) => social;

export { transfer2Qiniu, getBucket };

export const name = 'media';
