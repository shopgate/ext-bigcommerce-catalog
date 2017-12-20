const ShopgateProductBuilder = require('./product/ShopgateBuilder')

class ShopgateProductRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {BigCommerceRepository} bigCommerceStoreConfigurationRepository
   */
  constructor (apiVersion3Client, bigCommerceStoreConfigurationRepository) {
    this._client = apiVersion3Client
    this._bigCommerceStoreConfigurationRepository = bigCommerceStoreConfigurationRepository
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    const response = await this._client.get('/catalog/products/' + id + '?include=variants')
    const shopgateProductBuilder = new ShopgateProductBuilder(response.data, await this._bigCommerceStoreConfigurationRepository.getCurrency())

    return shopgateProductBuilder.build()
  }
}

module.exports = ShopgateProductRepository
