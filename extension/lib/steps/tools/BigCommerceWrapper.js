const BigCommerce = require('node-bigcommerce')
const BIGC_TIME_LOG_FLAG = 'BigCommerce API Time Log Entry'

class BigCommerceWrapper {
  /**
   * @param {string} logLevel
   * @param {string} clientId
   * @param {string} accessToken
   * @param {string} storeHash
   * @param {string} responseType
   * @param {string} apiVersion
   */
  constructor ({logLevel, clientId, accessToken, storeHash, responseType, apiVersion}) {
    this._bigCommerce = new BigCommerce({
      logLevel: logLevel,
      clientId: clientId,
      accessToken: accessToken,
      storeHash: storeHash,
      responseType: responseType,
      apiVersion: apiVersion
    })
    this._logStorage = []
  }

  /**
   * @param {Date} startTime
   * @param {string} message
   * @return BigCommerceWrapperLogMetaData
   * @private
   */
  _createTimeLogMeta (startTime, message) {
    const endTime = new Date()
    const duration = endTime - startTime
    return {duration: duration, description: message}
  }

  /**
   * @param {Date} startTime
   * @param {string} message
   * @private
   */
  _logTime (startTime, message) {
    this._logStorage.push({
      metaData: this._createTimeLogMeta(startTime, message),
      message: BIGC_TIME_LOG_FLAG
    })
  }

  /**
   * @param {string} type
   * @param {string} path
   * @param {Object} [data]
   * @return {Promise.<*>}
   */
  async request (type, path, data) {
    const startTime = new Date()
    const response = await this._bigCommerce.request(type, path, data)
    this._logTime(startTime, type + ' ' + path)
    return response
  }

  /**
   * @param {string} path
   * @return {Promise.<*>}
   */
  async get (path) {
    const startTime = new Date()
    const response = await this._bigCommerce.get(path)
    this._logTime(startTime, 'get ' + path)
    return response
  }

  /**
   * @param {string} path
   * @param {Object} data
   * @return {Promise.<*>}
   */
  async post (path, data) {
    const startTime = new Date()
    const response = await this._bigCommerce.post(path, data)
    this._logTime(startTime, 'post ' + path)
    return response
  }

  /**
   * @param {string} path
   * @param {Object} data
   * @return {Promise.<*>}
   */
  async put (path, data) {
    const startTime = new Date()
    const response = await this._bigCommerce.put(path, data)
    this._logTime(startTime, 'put ' + path)
    return response
  }

  /**
   * @param {string} path
   * @return {Promise.<*>}
   */
  async delete (path) {
    const startTime = new Date()
    const response = await this._bigCommerce.delete(path)
    this._logTime(startTime, 'delete ' + path)
    return response
  }

  /**
   * @return {BigCommerceWrapperLog[]}
   */
  get timeLogs () {
    return this._logStorage
  }
}

module.exports = BigCommerceWrapper
