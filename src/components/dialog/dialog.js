// src/components/dialog/dialog.js
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    visible: false,
  },

  created() {},

  methods: {
    toggleDialog() {
      this.setData({
        visible: !this.data.visible,
      });
      this.triggerEvent('toggletabbar', { isDialogVisible: this.data.visible });
    },
  },
});
