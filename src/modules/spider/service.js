/**
 * by Billy Yang
 */
import cheerio from 'cheerio';

import { get } from '../util/request';
import config, { INS_HOST } from '../util/config';
import { transfer2Qiniu, getBucket } from '../util/services/media';

/**
 * 把script标签转成json对象
 * 通过eval方法，直接执行这段赋值语句
 */
const script2JSON = script => {
  let window = {};
  eval(script);
  return window._sharedData;
};

const parsePageData = html => {
  const $ = cheerio.load(html);
  const script = $('span#react-root').next().html();
  const data = script2JSON(script);
  return data;
};

const getQueryHash = async html => {
  const $ = cheerio.load(html);
  const href = $('link[rel="preload"]').attr('href');
  const { data: script } = await get(`${INS_HOST}${href}`);
  let arr = script.split('queryId');
  arr = arr[2].split('"');
  const queryHash = arr[1];
  return queryHash;
};

const getPageData = async url => {
  const { data: html } = await get(url);
  return parsePageData(html);
};

const handleMedium = async (medium, username) => {
  const {
    display_url: displayUrl, // 图片，或是视频的封面
    video_url: videoUrl, // 视频地址
    is_video: isVideo
  } = medium;
  const type = isVideo ? 'video' : 'img';
  const sample = { type };
  if (isVideo) {
    sample.url = await transfer2Qiniu({ uri: videoUrl, bucket: getBucket(username, config.app.social) });
    sample.thumb = await transfer2Qiniu({ uri: displayUrl, bucket: getBucket(username, config.app.social) });
  } else {
    sample.url = await transfer2Qiniu({ uri: displayUrl, bucket: getBucket(username, config.app.social) });
  }
  return sample;
};

export { parsePageData, getQueryHash, getPageData, handleMedium };
export const name = 'spider';
