const ShopgateVariantBuilder = require('../service/ShopgateVariantBuilder')
const ShopgateCharacteristicBuilder = require('../service/ShopgateCharacteristicBuilder')

/**
 * @property {BigCommerceBrandRepository} _bigCommerceBrandRepository
 */
class ShopgateVariantRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {BigCommerceRepository} bigCommerceStoreConfigurationRepository
   * @param {BigCommerceBrandRepository} bigCommerceBrandRepository
   */
  constructor (apiVersion3Client) {
    this._client = apiVersion3Client
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProduct>}
   */
  async get (id) {
    const response = await this._client.get('/catalog/products/' + id + '?include=variants')
    const parentProduct = response.data

    let variants = { products: [], characteristics: [] }
    parentProduct.variants.forEach(variant => {
      let builder = new ShopgateVariantBuilder(parentProduct, variant)
      variants.products.push(builder.build())
    })

    variants.characteristics = new ShopgateCharacteristicBuilder(parentProduct.variants).build()
    return variants
  }
}

module.exports = ShopgateVariantRepository
