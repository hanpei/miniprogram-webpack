class BaseModel {
  constructor(props = {}) {
    this.props = props;
  }

  getProps() {
    return this.props;
  }

  setProps(data) {
    const defaultProps = this.constructor.defaultProps;
    if (!data) {
      return defaultProps;
    }
    Object.keys(data).forEach(key => {
      if (defaultProps) {
        this.props[key] =
          data[key] === undefined ? defaultProps[key] : data[key];
      } else {
        this.props[key] = data[key];
      }
    });
    return this.props;
  }

  /**
   * 格式化接口数据
   * @param {*} data 接口返回的数据
   * @param {function} mapper 接口数据字段映射
   */
  responseConverter(data, mapper = m => m) {
    return this.setProps(mapper(data));
  }

  
  convert(data, mapperName = 'mapper') {
    return this.responseConverter(data, this[mapperName]);
  }

  /**
   * @deprecated
   * @param {*} defaultProps
   * @param {*} data
   */
  mergeProps(defaultProps, data) {
    Object.keys(data).forEach(key => {
      this[key] =
        data[key] === undefined || data[key] === null
          ? defaultProps[key]
          : data[key];
    });
    return this;
  }
}

export default BaseModel;
