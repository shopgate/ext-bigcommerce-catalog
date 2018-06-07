/**
 * @typedef {Object} ShopgateImagesDefinition
 * @property {string[]} [images]
 */

/**
 * @type ShopgateImagesDefinition
 */
class ShopgateImages {
  /**
   * @param {string[]} [images]
   */
  constructor (/** @type {ShopgateImagesDefinition} */ {images}) {
    this.images = images
  }
}

module.exports = ShopgateImages
