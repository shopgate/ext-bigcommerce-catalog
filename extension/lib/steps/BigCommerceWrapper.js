const BigCommerce = require('node-bigcommerce')

class BigCommerceWrapper extends BigCommerce {
  /**
   * @param {BigCommerceWrapperConfig} config
   * @param {Object} cacheConfig
   */
  constructor (config, cacheConfig) {
    super(config)
    this._timings = []
    this._measureRequestDuration = config.measureRequestDuration || false
    if (cacheConfig.cacheLifetime !== null && cacheConfig.cacheLifetime !== 0) {
      this._cacheLifetime = cacheConfig.cacheLifetime
      this._extensionStorage = cacheConfig.extensionStorage
    }
  }

  /**
   * @param {string} path
   * @param {string} type
   * @return {number}
   * @private
   */
  _timeStarted (path, type) {
    if (!this._measureRequestDuration) {
      return 0
    }

    return this._timings.push({
      path: path,
      method: type,
      apiVersion: this.apiVersion,
      startedOn: new Date()
    })
  }

  /**
   * @param {number} requestId
   * @private
   */
  _timeFinished (requestId) {
    if (!this._measureRequestDuration) {
      return
    }

    const timing = this._timings[requestId - 1]
    timing.requestId = requestId
    timing.finishedOn = new Date()
    timing.durationMilliseconds = timing.finishedOn.getTime() - timing.startedOn.getTime()
    this._timings[requestId] = timing
  }

  /**
   * @param {string} type
   * @param {string} path
   * @param {Object} [data]
   * @return {Promise.<*>}
   */
  async request (type, path, data) {
    const cacheKey = this.config.storeHash + path
    if (type === 'get') {
      const cacheData = await this._getCache(cacheKey)
      if (cacheData !== undefined) {
        return cacheData
      }
    }

    const requestId = this._timeStarted(path, type)
    const response = await super.request(type, path, data)
    this._timeFinished(requestId)

    if (type === 'get') {
      await this._setCache(cacheKey, response)
    }

    return response
  }

  /**
   * @param {string} key
   * @private
   */
  async _getCache (key) {
    if (this._cacheLifetime === undefined) {
      return
    }
    const cacheData = await this._getfromStorage(key)
    if (cacheData === undefined) {
      return
    }
    const cachedTime = new Date(cacheData.time)
    const invalidTime = new Date()
    invalidTime.setSeconds(invalidTime.getSeconds() - this._cacheLifetime)
    if (invalidTime < cachedTime) {
      delete cacheData.time
      return cacheData
    }
  }

  /**
   * @param {string} key
   * @private
   */
  async _getfromStorage (key) {
    return this._extensionStorage.get(key).then((cacheData) => {
      return cacheData
    }).catch((error) => {
      console.log(error)
    })
  }

  /**
   * @param {string} key
   * @param {Object} cacheData
   * @private
   */
  async _setCache (key, cacheData) {
    if (this._cacheLifetime === undefined) {
      return
    }
    cacheData.time = new Date()
    await this._addToStorage(key, cacheData)
  }

  /**
   * @param {string} key
   * @param {Object} cacheData
   * @private
   */
  async _addToStorage (key, cacheData) {
    this._extensionStorage.set(key, cacheData).then(cacheData => {
    }).catch((error) => {
      console.log(error)
    })
  }

  /**
   * @return {BigCommerceWrapperTiming[]}
   */
  get timings () {
    return this._timings
  }
}

module.exports = BigCommerceWrapper
