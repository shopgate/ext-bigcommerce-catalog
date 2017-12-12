const ShopgateProductBuilder = require('./product/ShopgateBuilder')

class ShopgateProductRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {BigCommerceConfigurationRepository} bigCommerceConfigRepository
   */
  constructor (apiVersion3Client, bigCommerceConfigRepository) {
    this._client = apiVersion3Client
    this._bigCommerceConfigRepository = bigCommerceConfigRepository
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    const response = await this._client.get('/catalog/products/' + id + '?include=variants')
    const shopgateProductBuilder = new ShopgateProductBuilder(response.data, await this._bigCommerceConfigRepository.getCurrency())

    return shopgateProductBuilder.build()
  }
}

module.exports = ShopgateProductRepository
