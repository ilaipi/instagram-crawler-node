import mongoose from 'mongoose';
import cheerio from 'cheerio';
import { get as getField } from 'lodash';

import { get } from '../util/request';
import { transfer2Qiniu, getBucket } from '../util/services/media';
import { m } from '../util/services/instagram';
import logger from '../util/log';

const INS_HOST = 'https://www.instagram.com';

const SOCIAL = 'instagram';

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
    sample.url = await transfer2Qiniu({ uri: videoUrl, bucket: getBucket(username, SOCIAL) });
    sample.thumb = await transfer2Qiniu({ uri: displayUrl, bucket: getBucket(username, SOCIAL) });
  } else {
    sample.url = await transfer2Qiniu({ uri: displayUrl, bucket: getBucket(username, SOCIAL) });
  }
  return sample;
};

const handlePost = async detail => {
  const post = getField(detail, 'entry_data.PostPage[0].graphql.shortcode_media');
  const {
    edge_media_to_caption: { edges: texts }, // 文本内容
    edge_sidecar_to_children: { edges: media } = {}, // 多个图片或视频时包在这个里面
    display_url, // 图片，或是视频的封面
    video_url, // 视频地址
    is_video,
    taken_at_timestamp: timestamp,
    shortcode,
    owner: { username },
    __typename: type // 类型 e.g. GraphSidecar GraphVideo GraphImage
  } = post;
  const sample = {
    text: getField(texts[0], 'node.text'),
    type,
    uri: shortcode,
    date: new Date(timestamp * 1000),
    media: [],
    social: SOCIAL
  };
  if (type === 'GraphSidecar') {
    for (const { node: medium } of media) {
      sample.media.push(await handleMedium(medium, username));
    }
  } else {
    sample.media.push(await handleMedium({ display_url, video_url, is_video }, username));
  }
  const ProviderPost = mongoose.model('ProviderPost');
  await ProviderPost.create(sample);
};

const handlePage = async ({ username, queryHash, gis, id }, { edge_owner_to_timeline_media: timeline, edge_user_to_photos_of_you: timeline2 }) => {
  const { edges: posts, page_info: { has_next_page: nextPage, end_cursor: endCursor } } = timeline || timeline2;
  for (const { node: post } of posts) {
    const { shortcode } = post;
    const data = await getPageData(`${INS_HOST}/p/${shortcode}`);
    await handlePost(data);
  }
  if (nextPage) {
    const variables = {
      id,
      first: 12,
      after: endCursor
    };
    const gisBase = `${gis}:${JSON.stringify(variables)}`;
    const gisHeader = m(gisBase);
    const { data } = await get(`${INS_HOST}/graphql/query/`, {
      query_hash: queryHash,
      variables
    }, {
      headers: { 'x-instagram-gis': gisHeader }
    });
    await handlePage({ username, queryHash, gis, id }, getField(data, 'data.user'));
  }
};

export default async (username) => {
  const { data: html } = await get(`${INS_HOST}/${username}`);
  const queryHash = await getQueryHash(html);
  const fieldPath = 'entry_data.ProfilePage[0].graphql.user';
  const data = parsePageData(html);
  const profile = getField(data, fieldPath);
  const gis = getField(data, 'rhx_gis');
  try {
    await handlePage({ username, queryHash, gis, id: profile.id }, profile);
  } catch (err) {
    logger.warn({ err, username }, '爬取用户instagram异常');
  }
};
