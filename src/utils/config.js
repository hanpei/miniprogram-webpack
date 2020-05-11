// NODE_ENV, 打包时取webpack传进来的环境变量，确定打包时代码是否压缩或其他处理
// DIST_ENV, 小程序发版环境，决定api接口等不同配置：
// production: 生产环境； test: 测试环境
// const env = process.env.NODE_ENV;
const isDebug = process.env.DIST_ENV !== 'production';

// const DEVELOPMENT_DOMAIN = 'guoanshequ.top'; // 开发/预生产环境
const DEVELOPMENT_DOMAIN = 'endpoint.test'; // 开发/预生产环境
const PRODUCTION_DOMAIN = 'endpoint.production'; // 生产环境

const getDomain = isDebug => {
  if (isDebug) {
    return DEVELOPMENT_DOMAIN;
  } else {
    return PRODUCTION_DOMAIN;
  }
};

const apiDomain = getDomain(isDebug);

const amapKey = ''; 

module.exports = {
  apiDomain,
  amapKey,
};
