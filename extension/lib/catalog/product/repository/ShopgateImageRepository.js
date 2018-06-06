const ShopgateImageBuilder = require('../service/ShopgateImageBuilder')
/**
 * Retrieves images for a product or its variant
 */
class ShopgateImageRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this._client = apiVersion3Client
  }

  /**
   * @param {string} id
   * @returns {ShopgateImages}
   */
  async get (id) {
    const variantId = id.includes('-') ? Number.parseInt(id.split('-').pop()) : 0
    const response = await this._client.get('/catalog/products/' + Number.parseInt(id) + '?include=variants,images')
    const images = new ShopgateImageBuilder(response.data, variantId).build()

    return images
  }
}

module.exports = ShopgateImageRepository
