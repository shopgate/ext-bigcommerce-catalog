const BigCommerce = require('node-bigcommerce')

class BigCommerceFactory {
  /**
   * @param {string} clientId
   * @param {string} accessToken
   * @param {string} storeHash
   * @param {string} logLevel
   */
  constructor (clientId, accessToken, storeHash, logLevel = 'info') {
    this._clientId = clientId
    this._storeHash = storeHash
    this._accessToken = accessToken
    this._logLevel = logLevel
  }

  /**
   * @returns {BigCommerce}
   */
  createV3 () {
    return new BigCommerce({
      logLevel: this._logLevel,
      clientId: this._clientId,
      accessToken: this._accessToken,
      storeHash: this._storeHash,
      responseType: 'json',
      apiVersion: 'v3'
    })
  }

  /**
   * @returns {BigCommerce}
   */
  createV2 () {
    return new BigCommerce({
      logLevel: this._logLevel,
      clientId: this._clientId,
      accessToken: this._accessToken,
      storeHash: this._storeHash,
      responseType: 'json',
      apiVersion: 'v2'
    })
  }
}

module.exports = BigCommerceFactory
