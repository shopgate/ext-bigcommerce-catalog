const BigCommerceWrapper = require('./BigCommerceWrapper')

/**
 * @property {string} _clientId
 * @property {string} _accessToken
 * @property {string} _storeHash
 * @property {object} _cacheConfig
 */
class BigCommerceFactory {
  /**
   * @param {string} clientId
   * @param {string} accessToken
   * @param {string} storeHash
   * @param {object} cacheConfig
   */
  constructor (clientId, accessToken, storeHash, cacheConfig = {}) {
    this._clientId = clientId
    this._accessToken = accessToken
    this._storeHash = storeHash
    this._cacheConfig = cacheConfig
  }

  /**
   * @param {string} logLevel
   * @return {BigCommerceWrapper}
   */
  createV3 (logLevel = 'info') {
    return new BigCommerceWrapper({
      logLevel: logLevel,
      clientId: this._clientId,
      accessToken: this._accessToken,
      storeHash: this._storeHash,
      responseType: 'json',
      apiVersion: 'v3',
      measureRequestDuration: true
    }, this._cacheConfig)
  }

  /**
   * @param {string} logLevel
   * @return {BigCommerceWrapper}
   */
  createV2 (logLevel = 'info') {
    return new BigCommerceWrapper({
      logLevel: logLevel,
      clientId: this._clientId,
      accessToken: this._accessToken,
      storeHash: this._storeHash,
      responseType: 'json',
      apiVersion: 'v2',
      measureRequestDuration: true
    }, this._cacheConfig)
  }
}

module.exports = BigCommerceFactory
