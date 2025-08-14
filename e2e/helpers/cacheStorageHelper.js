// eslint-disable-next-line camelcase
const Helper = codecept_helper;

class CacheStorageHelper extends Helper {
  testStorage = {};

  async addToStorage(key, value) {
    this.testStorage[key] = value;
  }

  async getFromStorage(key) {
    return this.testStorage[key] !== undefined ? this.testStorage[key] : false;
  }
}

module.exports = CacheStorageHelper;
