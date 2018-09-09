import mongoose from 'mongoose';
import { get as getField } from 'lodash';

import config, { INS_HOST } from '../../util/config';
import { getPageData, handleMedium } from '../service';

/**
 * 第三层爬虫
 * @param { Object } task Provider instance
 */
const crawler = async ({ shortcode }) => {
  const data = await getPageData(`${INS_HOST}/p/${shortcode}`);
  const post = getField(data, 'entry_data.PostPage[0].graphql.shortcode_media');
  const {
    edge_media_to_caption: { edges: texts }, // 文本内容
    edge_sidecar_to_children: { edges: media } = {}, // 多个图片或视频时包在这个里面
    taken_at_timestamp: timestamp,
    owner: { username },
    __typename: type, // 类型 e.g. GraphSidecar GraphVideo GraphImage
    ...others
  } = post;
  const sample = {
    text: getField(texts[0], 'node.text'),
    type,
    uri: shortcode,
    date: new Date(timestamp * 1000),
    media: [],
    social: config.app.social
  };
  if (type === 'GraphSidecar') {
    for (const { node: medium } of media) {
      sample.media.push(await handleMedium(medium, username));
    }
  } else {
    sample.media.push(await handleMedium({ ...others }, username));
  }
  const ProviderPost = mongoose.model('ProviderPost');
  await ProviderPost.update({ uri: shortcode }, sample, { upsert: true });
};

export { crawler };

export const level = 3;
