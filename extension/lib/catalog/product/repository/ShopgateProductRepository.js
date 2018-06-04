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
   * @param {string} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    let variantId = 0
    if (id.includes('-')) {
      variantId = Number.parseInt(id.split('-').pop())
    }

    const response = await this._client.get('/catalog/products/' + Number.parseInt(id) + '?include=variants,images')
    const shopgateProductBuilder = new ShopgateProductBuilder(response.data, await this._bigCommerceStoreConfigurationRepository.getCurrency(), variantId)

    const shopgateProduct = shopgateProductBuilder.build()
    shopgateProduct.manufacturer = await this._bigCommerceBrandRepository.get(response.data.brand_id)

    return shopgateProduct
  }
}

module.exports = ShopgateProductRepository
