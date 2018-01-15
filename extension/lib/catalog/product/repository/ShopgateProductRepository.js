const ShopgateProductBuilder = require('../service/ShopgateProductBuilder')

/**
 * @property {BigCommerceBrandRepository} _bigCommerceBrandRepository
 */
class ShopgateProductRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {BigCommerceRepository} bigCommerceStoreConfigurationRepository
   * @param {BigCommerceBrandRepository} bigCommerceBrandRepository
   * @param {StoreLogger} storeLogger
   */
  constructor (apiVersion3Client, bigCommerceStoreConfigurationRepository, bigCommerceBrandRepository, storeLogger) {
    this._client = apiVersion3Client
    this._bigCommerceStoreConfigurationRepository = bigCommerceStoreConfigurationRepository
    this._bigCommerceBrandRepository = bigCommerceBrandRepository
    this._storeLogger = storeLogger
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    this._storeLogger.startTimmer()
    const response = await this._client.get('/catalog/products/' + id + '?include=variants')
    this._storeLogger.logTime('get product')
    this._storeLogger.startTimmer()
    const shopgateProductBuilder = new ShopgateProductBuilder(response.data, await this._bigCommerceStoreConfigurationRepository.getCurrency())
    this._storeLogger.logTime('build product after getting currency')

    const shopgateProduct = shopgateProductBuilder.build()
    this._storeLogger.startTimmer()
    shopgateProduct.manufacturer = await this._bigCommerceBrandRepository.get(response.data.brand_id)
    this._storeLogger.logTime('set manufacturer after getting brand information')

    return shopgateProduct
  }
}

module.exports = ShopgateProductRepository
