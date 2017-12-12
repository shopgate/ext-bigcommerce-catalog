const ShopgateProductBuilder = require('./product/ShopgateBuilder')

class ShopgateProductRepository {
  /**
   * @param {BigCommerce} client
   * @param {BigCommerceConfigurationRepository} bigCommerceConfigRepository
   */
  constructor (client, bigCommerceConfigRepository) {
    this.client = client
    this.bigCommerceConfigRepository = bigCommerceConfigRepository
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    const response = await this.client.get('/catalog/products/' + id + '?include=variants')
    const shopgateProductBuilder = new ShopgateProductBuilder(response.data, await this.bigCommerceConfigRepository.getCurrency())

    return shopgateProductBuilder.build()
  }
}

module.exports = ShopgateProductRepository
