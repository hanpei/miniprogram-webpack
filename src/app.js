import api from '@utils/api';
import config from './utils/config';
import './mixins/mixins';
import { store } from './mixins/store';
import { getLocalStorageSync, setLocalStorageSync } from '@utils/localStorage';
import wxApi from '@common/wxApi';

App({
  store, // 方便getApp查看store

  onLaunch(options) {
    this.setupLog();
    this.getSystemInfo();
    // this.checkUserLogin();
    this.getCurrentAddress();

  },

  setupLog() {
    console.log('%c==================================', 'color: green');
    console.log(
      `%c运行环境: ${process.env.NODE_ENV}`,
      'font-weight: bold;color: green'
    );
    console.log(
      `%c构建类型: ${process.env.DIST_ENV}`,
      'font-weight: bold;color: green'
    );
    console.log(
      `%c接口域名: ${config.apiDomain}`,
      'font-weight: bold;color: green'
    );
    console.log('%c==================================\n\n\n', 'color: green');
  },

  checkUserLogin() {
    const token = getLocalStorageSync('token');
    if (token) {
      const userInfo = getLocalStorageSync('userInfo');
      this.store.setState({ isLogin: true, userInfo });

      this.getCartNum();
    } else {
      this.store.setState({ isLogin: false });
    }
  },

  // 获取系统信息
  getSystemInfo() {
    const that = this;
    wx.getSystemInfo({
      success(res) {
        console.log('wx.getSystemInfo', res);
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.statusBarHeight = res.statusBarHeight;
        that.globalData.titleBarHeight =
          wx.getMenuButtonBoundingClientRect().bottom +
          wx.getMenuButtonBoundingClientRect().top -
          res.statusBarHeight * 2;

        if (res.model.indexOf('iPhone X') > -1) {
          that.globalData.iphoneX = true;
        } else {
          that.globalData.iphoneX = false;
        }
      },
      fail: () => {
        this.globalData.statusBarHeight = 20;
        this.globalData.titleBarHeight = 44;
      },
    });
  },

  getCurrentAddress() {
    return this.getLocation()
      .then(this.getAddress)
      .catch(err => {
        console.log(err);
      });
  },

  // 调用微信自带接口 获取当前经纬度
  getLocation() {
    // 获取当前经纬度
    return wxApi
      .getLocation()
      .then(({ longitude, latitude }) => ({ longitude, latitude }));
  },

  // 根据经纬度获取地址信息
  getAddress({ longitude, latitude }) {
    return api
      .getAddressAroundGpsFromAmap({ longitude, latitude })
      .then(res => {
        if (res.statusCode === 200 && res.data.count > 0) {
          const data = res.data.pois[0];
          const address = AddressModel.convertAmapResonse(data);
          setLocalStorageSync('location', address);
          return address;
        }
      });
  },

  globalData: {
    token: '',
    userInfo: null,
    iphoneX: false,
    openId: '',
    needToRefresh: false,
  },
});
