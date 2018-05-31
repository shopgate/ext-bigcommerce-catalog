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
    const requestId = this._timeStarted(path, type)
    const response = await super.request(type, path, data)
    this._timeFinished(requestId)

    return response
  }

  /**
   * @return {BigCommerceWrapperTiming[]}
   */
  get timings () {
    return this._timings
  }
}

module.exports = BigCommerceWrapper
