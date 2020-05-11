Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    styleIsolation: 'apply-shared',
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isTouchMove: {
      type: Boolean,
      value: false,
    },
    itemId: {
      type: String,
      value: '',
    },
    itemIndex: {
      type: Number,
      value: -1,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  created() {
    this.startX = 0; // 开始坐标
    this.startY = 0;
  },
  attached() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    touchstart(e) {
      // 开始触摸时 重置所有删除
      this.startX = e.changedTouches[0].clientX;
      this.startY = e.changedTouches[0].clientY;
      this.setData({
        isTouchMove: false,
      });
      this.triggerEvent('handlerest');
    },
    // 滑动事件处理
    touchmove(e) {
      // 当前索引
      // 开始X坐标, 开始Y坐标
      const { startX, startY } = this;
      // 滑动变化坐标
      const touchMoveX = e.changedTouches[0].clientX;
      // 滑动变化坐标
      const touchMoveY = e.changedTouches[0].clientY;

      // 获取滑动角度
      const angle = this.calcAngle(
        { X: startX, Y: startY },
        { X: touchMoveX, Y: touchMoveY }
      );

      if (Math.abs(angle) > 30) return;
      let isTouchMove = false;
      if (touchMoveX > startX) {
        // 右滑
        isTouchMove = false;
      } else {
        // 左滑
        isTouchMove = true;
      }
      // 更新数据
      this.setData({ isTouchMove });
    },

    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    calcAngle(start, end) {
      var _X = end.X - start.X;
      var _Y = end.Y - start.Y;
      // 返回角度 /Math.atan()返回数字的反正切值
      return (360 * Math.atan(_Y / _X)) / (2 * Math.PI);
    },
    handledel(e) {
      const { id, index } = e.currentTarget.dataset;
      this.triggerEvent('handledel', { id, index });
    },
  },
});
