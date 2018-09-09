/**
 * by Billy Yang
 */
import fs from 'fs';
import path from 'path';

import qiniu from 'qiniu';
import { toLower, ceil } from 'lodash';
import filesize from 'filesize';

import config from '../util/config';

const mac = new qiniu.auth.digest.Mac(config.qiniu.accessKey, config.qiniu.secretKey);
const qiniuConfig = new qiniu.conf.Config();
// 空间对应的机房，Zone_z0对应华东机房
qiniuConfig.zone = qiniu.zone.Zone_z0;
const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
const resumeUploader = new qiniu.resume_up.ResumeUploader(config);

const uptoken = (bucket, key) => {
  const policy = `${bucket}:${key}`;
  const putPolicy = new qiniu.rs.PutPolicy({ scope: policy });
  return putPolicy.uploadToken(mac);
};

const uploadFilePromise = async ({name, token, key, filePath, buffer, bucket, mimetype}) => {
  const putExtra = new qiniu.form_up.PutExtra('', {}, mimetype);
  let uploader = formUploader;
  if (filePath) {
    const fileStat = await fs.statSync(filePath);
    const size = fileStat.size / 1048576; // 1024 * 1024 = 1048576，转换为MB
    if (size > 4) { // 七牛建议，分片的时候，每片大小4M左右
      uploader = resumeUploader;
      putExtra.params = {
        'x:name': '',
        'x:age': ceil(size / 4) // 分片个数
      };
    }
  }
  const putMedhotd = filePath ? 'putFile' : 'put';
  const response = await new Promise((resolve, reject) => {
    uploader[putMedhotd](token, key, filePath || buffer, putExtra, function (err, ret, info) {
      if (!err) {
        // 上传成功， 处理返回值
        resolve({success: 1, hash: ret.hash, key: ret.key, persistentId: ret.persistentId});
      } else {
        // 上传失败， 处理返回代码
        reject({success: 0, err});
      }
    });
  });
  if (response.success === 1) {
    let stat = {};
    if (filePath) {
      stat = await fs.statSync(filePath);
    } else {
      stat.size = buffer.length;
    }
    return {
      name,
      key,
      bucket,
      readableSize: filesize(stat.size),
      size: stat.size,
      original: name,
      state: 'SUCCESS',
      type: toLower(path.extname(name))
    };
  } else {
    return {
      err: response.err
    };
  }
};

/**
 * 支持本地文件(filePath)和内存字节(buffer)
 */
const uploadFile = async ({key, filePath, bucket, name, mimetype, buffer}) => {
  // 生成上传 Token
  const token = uptoken(bucket, key);
  // 调用uploadFile上传
  const res = await uploadFilePromise({token, key, filePath, buffer, name, bucket, mimetype});
  if (filePath) {
    await fs.unlinkSync(filePath);
  }
  return res;
};

export { uploadFile };

export const name = 'qiniu';
