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
    const response = await this._client.get('/catalog/products/' + id + '?include=variants,images')
    const parentProduct = response.data

    let variants = { products: [], characteristics: [] }
    parentProduct.variants.forEach(variant => {
      const product = new ShopgateVariantBuilder(parentProduct, variant).build()
      // gray out variants that cannot be purchased
      if (product.stock.orderable) {
        variants.products.push(product)
      }
    })

    variants.characteristics = new ShopgateCharacteristicBuilder(parentProduct.variants).build()
    return variants
  }
}

module.exports = ShopgateVariantRepository
