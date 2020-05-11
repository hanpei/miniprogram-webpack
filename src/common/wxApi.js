import promisify from '../utils/promisify';

function paramObjToString(obj) {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined)
    .reduce((str, item) => `${str}&${item}=${obj[item]}`, '')
    .substr(1);
}

const wxApi = {
  navigateTo({ url, query, ...options }) {
    if (query) {
      const paramStr = paramObjToString(query);
      return promisify(wx.navigateTo)({
        ...options,
        url: `${url}?${paramStr}`,
      });
    } else {
      return promisify(wx.navigateTo)({ url, ...options });
    }
  },
  redirectTo({ url, query, ...options }) {
    if (query) {
      const paramStr = paramObjToString(query);
      return promisify(wx.redirectTo)({
        ...options,
        url: `${url}?${paramStr}`,
      });
    } else {
      return promisify(wx.redirectTo)({ url, ...options });
    }
  },
  reLaunch(url, query, ...options) {
    if (query) {
      const paramStr = paramObjToString(query);
      return promisify(wx.reLaunch)({
        ...options,
        url: `${url}?${paramStr}`,
      });
    } else {
      return promisify(wx.reLaunch)({ url, ...options });
    }
  },
  toast(message, duration = 2000) {
    const delay = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('hideToast');
        }, duration);
      });
    const showToast = promisify(wx.showToast);

    return showToast({
      title: message,
      icon: 'none',
      duration,
    }).then(delay);
  },
  scanCode(options) {
    return promisify(wx.scanCode)(options);
  },
  showModal(options) {
    return promisify(wx.showModal)(options);
  },
  getLocation(options) {
    // TODO: 授权处理
    return promisify(wx.getLocation)({ type: 'gcj02' });
  },
  openSetting(options) {
    return promisify(wx.openSetting)(options);
  },
};

export default wxApi;
