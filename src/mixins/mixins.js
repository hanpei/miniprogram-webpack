/*
作者：Jrain
链接：https://juejin.im/post/5d0a07eb6fb9a07eba2c4142
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
*/

// 定义小程序内置的属性/方法
const originProperties = ['data', 'properties', 'options'];
const originMethods = [
  'onLoad',
  'onReady',
  'onShow',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onShareAppMessage',
  'onPageScroll',
  'onTabItemTap',
];

const originPage = Page;

Page = options => {
  const { mixins } = options;
  if (Array.isArray(mixins)) {
    delete options.mixins;
    options = merge(mixins, options);
  }
  originPage(options);
};

function merge(mixins, options) {
  // Object merge
  mixins.forEach(mixin => {
    if (Object.prototype.toString.call(mixin) !== '[object Object]') {
      throw new Error('mixin 类型必须为对象! ');
    }

    Object.keys(mixin).forEach(key => {
      const value = mixin[key];
      if (originProperties.includes(key)) {
        // 内置属性
        options[key] = Object.assign({}, value, options[key]);
      } else if (originMethods.includes(key)) {
        // 内置方法
        const originFunc = options[key];
        options[key] = function(...args) {
          value.call(this, ...args);
          return originFunc && originFunc.call(this, ...args);
        };
      } else {
        // 自定义方法
        options = Object.assign({}, mixin, options);
      }
    });

    // ios safari 10以下，需要polyfill
    //     for (const [key, value] of Object.entries(mixin)) {
    //       if (originProperties.includes(key)) {
    //         // 内置属性
    //         options[key] = Object.assign({}, value, options[key]);
    //       } else if (originMethods.includes(key)) {
    //         // 内置方法
    //         const originFunc = options[key];
    //         options[key] = function(...args) {
    //           value.call(this, ...args);
    //           return originFunc && originFunc.call(this, ...args);
    //         };
    //       } else {
    //         // 自定义方法
    //         options = Object.assign({}, mixin, options);
    //       }
    //     }
  });

  return options;
}
