Component({
  options: {
    styleIsolation: 'apply-shared',
  },

  properties: {
    type: {
      type: String,
      value: 'default',
    },
  },
  methods: {
    toPageHome() {
      wx.switchTab({
        url: '/pages/home/main/main',
      });
    },
  },
});
