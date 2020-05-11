module.exports = {
  onLoad() {
    this.pages = getCurrentPages();
  },
  getPrevPageData(key) {
    const length = this.pages.length;
    if (length - 2 < 0) {
      return undefined;
    }
    if (key) {
      return this.pages[length - 2].data[key];
    } else {
      return this.pages[length - 2].data;
    }
  },
  setPrevPageData(data) {
    const length = this.pages.length;
    const prev = this.pages[length - 2];
    prev.setData(data);
  },
};
