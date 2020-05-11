Component({
  properties: {
    currentTabIndex: {
      type: Number,
      value: -1,
    },
    cartNum: {
      type: Number,
      value: 0,
    },
  },
  data: {
    selected: -1,
    color: '#7A7E83',
    selectedColor: '#333',
    list: [
      {
        // pagePath: '/pages/shop/shop',
        iconPath: '/assets/img/shop.png',
        selectedIconPath: '/assets/img/shop-selected.png',
        text: '首页',
      },
      {
        // pagePath: '/pages/shop/products/products',
        iconPath: '/assets/img/products.png',
        selectedIconPath: '/assets/img/products-selected.png',
        text: '全部商品',
      },
      {
        pagePath: '/pages/cart/cart',
        iconPath: '/assets/img/cart2.png',
        selectedIconPath: '/assets/img/cart2-selected.png',
        text: '购物车',
        badge: '',
        switchTab: true,
      },
    ],
  },
  observers: {
    'cartNum, currentTabIndex': function (cartNum, currentTabIndex) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      this.setData({
        selected: Number(currentTabIndex),
        'list[2].badge': cartNum,
      });
    },
  },
  lifetimes: {},
  methods: {
    tabChange(e) {
      var index = e.currentTarget.dataset.index;

      if (index === this.data.selected) {
        return;
      }
      this.setData({
        selected: index,
      });

      const item = this.data.list[index];

      if (item.switchTab) {
        wx.switchTab({ url: item.pagePath });
        return;
      }

      this.triggerEvent('change', {
        index: index,
        item: this.data.list[index],
      });
    },
  },
});
