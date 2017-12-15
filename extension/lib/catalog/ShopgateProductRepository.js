const ShopgateProductBuilder = require('./product/ShopgateBuilder')

class ShopgateProductRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {BigCommerceRepository} bigCommerceStoreConfigurationRepository
   * @param {ShopgateBrandRepository} shopgateBrandRepository
   */
  constructor (apiVersion3Client, bigCommerceStoreConfigurationRepository, shopgateBrandRepository) {
    this._client = apiVersion3Client
    this._bigCommerceStoreConfigurationRepository = bigCommerceStoreConfigurationRepository
    this._shopgateBrandRepository = shopgateBrandRepository
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    const response = await this._client.get('/catalog/products/' + id + '?include=variants')
    const shopgateProductBuilder = new ShopgateProductBuilder(response.data, await this._bigCommerceStoreConfigurationRepository.getCurrency(), await this._shopgateBrandRepository.get(response.data.brand_id))

    return shopgateProductBuilder.build()
  }
}

module.exports = ShopgateProductRepository
