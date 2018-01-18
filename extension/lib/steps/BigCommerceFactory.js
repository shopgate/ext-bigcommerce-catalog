const BigCommerceWrapper = require('./BigCommerceWrapper')

/**
 * @property {string} _clientId
 * @property {string} _accessToken
 * @property {string} _storeHash
 */
class BigCommerceFactory {
  /**
   * @param {string} clientId
   * @param {string} accessToken
   * @param {string} storeHash
   */
  constructor (clientId, accessToken, storeHash) {
    this._clientId = clientId
    this._accessToken = accessToken
    this._storeHash = storeHash
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
    })
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
    })
  }
}

module.exports = BigCommerceFactory
