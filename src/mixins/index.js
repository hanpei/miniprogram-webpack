const app = getApp();

module.exports = {
  data: {
    minxInitMsg: 'mixin init msg',
  },
  getGlobalData(key) {
    if (key) {
      return app.globalData[key];
    } else {
      return app.globalData;
    }
  },
  setGlobalData(key, data) {
    app.globalData[key] = data;
  },
};
