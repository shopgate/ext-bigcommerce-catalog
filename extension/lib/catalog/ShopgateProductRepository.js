const ShopgateProductBuilder = require('./product/ShopgateBuilder')

class ShopgateProductRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {BigCommerceStoreConfiguration} bigCommerceStoreConfiguration
   */
  constructor (apiVersion3Client, bigCommerceStoreConfiguration) {
    this._client = apiVersion3Client
    this._bigCommerceStoreConfiguration = bigCommerceStoreConfiguration
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    const response = await this._client.get('/catalog/products/' + id + '?include=variants')
    const shopgateProductBuilder = new ShopgateProductBuilder(response.data, await this._bigCommerceStoreConfiguration.getCurrency())

    return shopgateProductBuilder.build()
  }
}

module.exports = ShopgateProductRepository
