import { get as getField } from 'lodash';

import { createClient } from '../../util/service';
import { get } from '../../util/request';
import { INS_HOST } from '../../util/config';
import { parsePageData, getQueryHash } from '../service';

/**
 * 第一层爬虫
 * 访问用户首页，解析到翻页必须的参数以及第一页的数据
 * @param { Object } task Provider instance
 *   username provider.username
 */
const crawler = async ({ username }) => {
  const { data: html } = await get(`${INS_HOST}/${username}`);
  const queryHash = await getQueryHash(html);
  const fieldPath = 'entry_data.ProfilePage[0].graphql.user';
  const data = parsePageData(html);
  const profile = getField(data, fieldPath);
  const gis = getField(data, 'rhx_gis');
  const client = await createClient();
  await client.rpushAsync('level_2_tasks', JSON.stringify({
    profile,
    username,
    queryHash,
    gis,
    id: profile.id
  }));
};

export { crawler };

export const level = 1;
