class Model extends Events {
  constructor(initData) {
    super();
    this.data = initData || {};
  }

  set(newData) {
    this.data = { ...this.data, ...newData};
    this.notify('change', this.data);
  }

  get(key) {
    return this.data[key];
  }
}