// src/components/navigator/navigator.js
const app = getApp();

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    styleIsolation: 'isolated',
    // styleIsolation: 'apply-shared',
  },
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: '',
    },
    showPadding: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
    navigationBarHeight:
      app.globalData.statusBarHeight + app.globalData.titleBarHeight,
  },

  attached() {
    this.setData({
      isShowHome: getCurrentPages().length === 1,
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    backHome: function () {
      let pages = getCurrentPages();
      wx.navigateBack({
        delta: pages.length,
      });
    },
    back: function () {
      wx.navigateBack({
        delta: 1,
      });
    },
    loading: {
      type: Boolean,
      value: false,
    },
  },
});
