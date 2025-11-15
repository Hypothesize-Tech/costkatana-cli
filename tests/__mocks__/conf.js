// Mock for conf - CommonJS compatible
class MockConf {
  constructor(options = {}) {
    this._store = {};
    this.path = options.cwd || '/tmp/mock-config.json';
    this.schema = options.schema || {};
    
    // Initialize with default values from schema
    if (this.schema) {
      Object.keys(this.schema).forEach(key => {
        if (this.schema[key].default !== undefined) {
          this._store[key] = this.schema[key].default;
        }
      });
    }
  }

  get(key, defaultValue) {
    if (this._store[key] !== undefined) {
      return this._store[key];
    }
    if (this.schema[key] && this.schema[key].default !== undefined) {
      return this.schema[key].default;
    }
    return defaultValue;
  }

  set(key, value) {
    if (typeof key === 'object') {
      this._store = { ...this._store, ...key };
    } else {
      this._store[key] = value;
    }
  }

  has(key) {
    return key in this._store;
  }

  delete(key) {
    delete this._store[key];
  }

  clear() {
    // Keep defaults from schema
    const defaults = {};
    if (this.schema) {
      Object.keys(this.schema).forEach(key => {
        if (this.schema[key].default !== undefined) {
          defaults[key] = this.schema[key].default;
        }
      });
    }
    this._store = defaults;
  }

  get size() {
    return Object.keys(this._store).length;
  }

  get store() {
    return this._store;
  }

  set store(value) {
    this._store = value;
  }
}

module.exports = MockConf;
module.exports.default = MockConf;

