export function getLocalStorage(key) {
  return wx.getStorage({
    key: key,
    success: function(res) {
      return res.data;
    },
    fail: function(err) {
      return err;
    },
  });
}

export function setLocalStorage(key, value) {
  wx.setStorage({
    key: key,
    data: value,
  });
}

export function removeStorage(key) {
  wx.removeStorage({
    key: key,
    success: function(res) {
      return res.data;
    },
    fail: function(err) {
      return err;
    },
  });
}

export function clearStorage() {
  try {
    wx.clearStorage();
  } catch (e) {
    return e;
  }
}

export function getLocalStorageSync(key) {
  try {
    return wx.getStorageSync(key);
  } catch (e) {
    return e;
  }
}

export function setLocalStorageSync(key, value) {
  try {
    return wx.setStorageSync(key, value);
  } catch (e) {
    return e;
  }
}

export function removeStorageSync(key) {
  try {
    return wx.removeStorageSync(key);
  } catch (e) {
    return e;
  }
}

export function clearStorageSync() {
  try {
    return wx.clearStorageSync();
  } catch (e) {
    return e;
  }
}

export const storageCacheUtils = {
  set(key, value, minutes) {
    if (minutes) {
      const microseconds = minutes * 60 * 1000;
      const extraData = {
        [key]: value,
        expiredTime: Date.now() + microseconds,
      };
      setLocalStorageSync(key, value);
      setLocalStorageSync(`${key}Extra`, extraData);
    } else {
      setLocalStorageSync(key, value);
    }
  },
  get(key) {
    const data = getLocalStorageSync(key) || '';
    console.log(this.isExpired());
    if (this.isExpired(key)) {
      console.log('isExpiredisExpiredisExpired');
      removeStorageSync(key);
      removeStorageSync(`${key}Extra`);
      return '';
    } else {
      return data;
    }
  },
  isExpired(key) {
    const extraData = getLocalStorageSync(`${key}Extra`);
    const { expiredTime } = extraData;
    if (expiredTime === undefined) {
      return false;
    }
    if (expiredTime === 0) {
      return false;
    }
    if (Date.now() > expiredTime) {
      return true;
    } else {
      return false;
    }
  },
  remove(key) {
    if (key) {
      removeStorageSync(key);
      removeStorageSync(`${key}Extra`);
    }
  },
};
