const BigCommerceProductEntity = require('../entity/BigCommerceProduct')

class BigCommerceProductEntityFactory {
  /**
   * @param {BigCommerceRepository} bigCommerceStoreConfigurationRepository
   */
  constructor (bigCommerceStoreConfigurationRepository) {
    this._storeConfigurationRepository = bigCommerceStoreConfigurationRepository
  }
  /**
   * @param {BigCommerceProduct} bigCommerceProduct
   * @returns {BigCommerceProductEntity}
   */
  create (bigCommerceProduct) {
    return new BigCommerceProductEntity(bigCommerceProduct, this._storeConfigurationRepository)
  }
}

module.exports = BigCommerceProductEntityFactory
