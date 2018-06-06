const ShopgateImages = require('../entity/ShopgateImages')

class ShopgateImageBuilder {
  /**
   * @param {BigCommerceProduct} bigCommereProduct
   * @param {number} variantId
   */
  constructor (bigCommereProduct, variantId) {
    this.parent = bigCommereProduct
    this.variantId = variantId
  }

  /**
   * @see {@link https://developer.shopgate.com/docs/references/shopgate-pipelines/product-pipelines/product-properties/getproductimages-v1}
   * @returns {ShopgateImages}
   */
  build () {
    return new ShopgateImages({
      images: this._getImageLinks()
    })
  }

  /**
   * @returns {string[]}
   *
   * @private
   */
  _getImageLinks () {
    return this._isVariant() ? this._getVariantImageUrl() : this._getParentImages()
  }

  /**
   * @returns {strings[]}
   *
   * @private
   */
  _getParentImages () {
    return this.parent.images.filter(image => image.url_standard !== '').map(image => image.url_standard)
  }

  /**
   * @returns {string[]}
   *
   * @private
   */
  _getVariantImageUrl () {
    let urls = this.parent.variants.filter(variant => this._variantImageExists(variant)).map(image => image.image_url)

    if (urls.length === 0) {
      urls = this._getParentImages()
    }

    return urls
  }

  /**
   * @returns {boolean}
   *
   * @private
   */
  _isVariant () {
    return this.variantId > 0
  }

  /**
   * @param {BigCommerceProductVariant} variant
   * @returns {boolean}
   *
   * @private
   */
  _variantImageExists (variant) {
    return variant.id === this.variantId && variant.image_url !== ''
  }
}

module.exports = ShopgateImageBuilder
