class Store {
  constructor(initialState) {
    this.state = initialState;
    this.contexts = [];
  }

  _setState(data) {
    this.state = Object.assign({}, this.state, data);
  }

  getState() {
    return this.state;
  }

  _getDataForUpdate(keys) {
    return keys.reduce(
      (acc, key) => ({ ...acc, ...{ [key]: this.state[key] } }),
      {}
    );
  }

  mapState(keys, context) {
    if (!context || typeof context.setData !== 'function') {
      throw new Error('should pass page context');
    }
    const data = this._getDataForUpdate(keys);
    context.setData(data);
    this.contexts.push(context);
  }

  setState(payload) {
    if (typeof payload !== 'object') {
      throw new Error('setState: parameter must be object');
    }
    this._setState(payload);
    console.log('setState', payload, 'state', this.state);
    this.contexts.map(ctx => ctx.setData(payload));
  }
}

export default Store;
