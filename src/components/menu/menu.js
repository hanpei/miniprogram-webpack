// src/components/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array,
      value: [],
    },
    currentIndex: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    items: [],
    currentIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e) {
      const index = e.currentTarget.dataset.index;

      if (index === this.data.currentIndex) {
        return;
      }
      this.setData({
        currentIndex: index,
      });

      this.triggerEvent('menuchange', {
        index: index,
        item: this.data.items[index],
      });
    },
  },
});
