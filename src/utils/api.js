// import wxRequest from './request.js';
import config from './config';

import { paramObjToString } from '@utils/formatGetParams';

const { apiDomain, amapKey, apiAppid } = config;

const protocol = 'https:';

const phpApiPrefix = `${protocol}//wxapi.${apiDomain}`;
const javaApiPrefix = `${protocol}//gasq-web-api.${apiDomain}`;

const api = {
  // 根据经纬度获取地址
  getAddressAroundGpsFromAmap({ longitude, latitude }) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url:
          'https://restapi.amap.com/v3/place/around?key=' +
          amapKey +
          '&location=' +
          longitude +
          ',' +
          latitude +
          '&output=json&radius=10000&types=%E5%B0%8F%E5%8C%BA&extensions=all&types=汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
        success(res) {
          resolve(res);
        },
      });
    });
  },
  searchAddressSuggestion(city, keywords) {
    const param = {
      key: amapKey,
      keywords,
      city,
      // types: '商务住宅',
      offset: 15,
    };
    const paramStr = paramObjToString(param);
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `https://restapi.amap.com/v3/place/text?${paramStr}&types=汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施`,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  },

  searchAddressDetail(id) {
    const param = {
      key: amapKey,
      id,
    };
    const paramStr = paramObjToString(param);
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `https://restapi.amap.com/v3/place/detail?${paramStr}&types=汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施`,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  },
};
export default api;
