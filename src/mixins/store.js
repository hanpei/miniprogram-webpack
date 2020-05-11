// import Store from '@utils/store';
const Store = require('@utils/store').default;

const initialState = {
  isLogin: false,
  userInfo: null,
  cartNum: 0,
};

module.exports = {
  store: new Store(initialState),
};
