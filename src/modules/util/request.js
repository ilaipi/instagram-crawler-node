import axios from 'axios';
import { merge } from 'lodash';

const request = async (_options, method = 'GET') => {
  const options = merge(
    {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36'
      }
    },
    { ..._options },
    {
      method
    }
  );
  return axios(options);
};

/**
 * 封装get请求
 * @param { String } url 请求路径
 * @param { Object } 请求参数
 *  params GET请求参数
 */
const get = (url, params, _options) => {
  return request({ ..._options, params, url });
};
/**
 * 封装post请求
 * @param { Object } 请求参数
 *  data POST请求请求参数，对象形式
 */
const post = (url, data, _options) => {
  return request({ ..._options, data, url }, 'POST');
};

export { get, post, request };
