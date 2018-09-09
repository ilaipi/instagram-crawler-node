import { get as getField } from 'lodash';

import { createClient } from '../../util/service';
import { get } from '../../util/request';
import { INS_HOST } from '../../util/config';
import { m } from '../../util/services/instagram';

/**
 * 第二层爬虫
 * 负责解析本页的数据，并且判断是否有翻页，如果有下一页，则完成翻页并把翻页后的数据重新生成第二层任务
 * @param { Object } task Provider instance
 */
const crawler = async ({ profile, username, queryHash, gis, id, count = 0 }) => {
  const { edge_owner_to_timeline_media: timeline, edge_user_to_photos_of_you: timeline2 } = profile;
  const { edges: posts, page_info: { has_next_page: nextPage, end_cursor: endCursor } } = timeline || timeline2;
  const client = await createClient();
  let current = count;
  for (const { node: post } of posts) {
    const { shortcode } = post;
    // 每次每个用户抓取前100条
    await client.rpushAsync('level_3_tasks', JSON.stringify({ shortcode }));
    current += 1;
    if (current >= 100) {
      // 最多抓取100条
      return;
    }
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
    await client.rpushAsync('level_2_tasks', JSON.stringify({
      count: current,
      profile: getField(data, 'data.user'),
      username,
      queryHash,
      gis,
      id
    }));
  }
};

export { crawler };

export const level = 2;
