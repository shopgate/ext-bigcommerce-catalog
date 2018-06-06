/**
 * @typedef {Object} ShopgateProductImagesDefinition
 * @property {string[]} [images]
 */

/**
 * @type ShopgateProductImagesDefinition
 */
class ShopgateImages {
  /**
   * @param {string[]} [images]
   */
  constructor (/** @type {ShopgateProductImagesDefinition} */ { images }) {
    this.images = images
  }
}

module.exports = ShopgateImages
