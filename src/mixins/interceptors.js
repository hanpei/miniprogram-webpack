import { getLocalStorageSync } from '@utils/localStorage';
import wxApi from '@common/wxApi';

// checkAuth
export const checkAuth = {
  onLoad() {
    console.log('should check auth');
    const isAuthed = this.checkToken();
    if (!isAuthed) {
      // 传递登陆后跳转的url与optons
      const { route = 'pages/index/index', options } = this.getCurrentPage();
      console.log(route);
      wxApi.redirectTo({
        url: '/pages/login/wxLogin/wxLogin',
        query: { redirectUrl: `/${route}`, ...options },
      });
    }
  },
  checkToken() {
    const token = getLocalStorageSync('token');
    if (token) {
      return true;
    } else {
      return false;
    }
  },
  getCurrentPage() {
    const currentPages = getCurrentPages();
    const idx = currentPages.length - 1;
    const currentPage = currentPages[idx];
    return currentPage;
  },
};
