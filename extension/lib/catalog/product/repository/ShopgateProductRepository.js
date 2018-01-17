const ShopgateProductBuilder = require('../service/ShopgateProductBuilder')

/**
 * @property {BigCommerceBrandRepository} _bigCommerceBrandRepository
 */
class ShopgateProductRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {BigCommerceRepository} bigCommerceStoreConfigurationRepository
   * @param {BigCommerceBrandRepository} bigCommerceBrandRepository
   */
  constructor (apiVersion3Client, bigCommerceStoreConfigurationRepository, bigCommerceBrandRepository) {
    this._client = apiVersion3Client
    this._bigCommerceStoreConfigurationRepository = bigCommerceStoreConfigurationRepository
    this._bigCommerceBrandRepository = bigCommerceBrandRepository
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    const response = await this._client.get('/catalog/products/' + id + '?include=variants')
    const shopgateProductBuilder = new ShopgateProductBuilder(response.data, await this._bigCommerceStoreConfigurationRepository.getCurrency())

    const shopgateProduct = shopgateProductBuilder.build()
    shopgateProduct.manufacturer = await this._bigCommerceBrandRepository.get(response.data.brand_id)

    return shopgateProduct
  }
}

module.exports = ShopgateProductRepository
