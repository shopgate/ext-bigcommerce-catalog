const BigCommerce = require('node-bigcommerce')

class BigCommerceFactory {
  /**
   * @param {string} clientId
   * @param {string} accessToken
   * @param {string} storeHash
   * @param {string} logLevel
   */
  createV3 (clientId, accessToken, storeHash, logLevel = 'info') {
    return new BigCommerce({
      logLevel: logLevel,
      clientId: clientId,
      accessToken: accessToken,
      storeHash: storeHash,
      responseType: 'json',
      apiVersion: 'v3'
    })
  }

  /**
   * @param {string} clientId
   * @param {string} accessToken
   * @param {string} storeHash
   * @param {string} logLevel
   */
  createV2 (clientId, accessToken, storeHash, logLevel = 'info') {
    return new BigCommerce({
      logLevel: logLevel,
      clientId: clientId,
      accessToken: accessToken,
      storeHash: storeHash,
      responseType: 'json',
      apiVersion: 'v2'
    })
  }
}

module.exports = BigCommerceFactory
