const ShopgateVariantBuilder = require('../service/ShopgateVariantBuilder')
const ShopgateCharacteristicBuilder = require('../service/ShopgateCharacteristicBuilder')
const BigCommerceProduct = require('../read_model/BigCommerceProduct.js')

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
      const builder = new ShopgateVariantBuilder(parentProduct, variant)
      variants.products.push(builder.build())
    })

    const trackVariantInventory = parentProduct.inventory_tracking === BigCommerceProduct.Inventory.TRACKING_VARIANT
    variants.characteristics = new ShopgateCharacteristicBuilder(parentProduct.variants, trackVariantInventory).build()
    return variants
  }
}

module.exports = ShopgateVariantRepository
