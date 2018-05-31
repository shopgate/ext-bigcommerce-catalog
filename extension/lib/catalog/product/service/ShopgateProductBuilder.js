const ShopgateProduct = require('../entity/ShopgateProduct.js')
const ShopgateAvailibility = require('../value_objects/ShopgateAvailability.js')
const BigCommerceProduct = require('../read_model/BigCommerceProduct.js')
const ShopgateProductType = require('../value_objects/ShopgateType.js')

class ShopgateProductBuilder {
  /**
   * @param {BigCommerceProduct} mainProduct - either regular product or parent of a variant
   * @param {string} bigCommerceStoreCurrency
   * @param {number} variantId - 0 if it is not a variant
   */
  constructor (mainProduct, bigCommerceStoreCurrency, variantId) {
    this.mainProduct = mainProduct
    this.variantId = variantId
    this.variant = variantId === 0
      ? mainProduct.variants[0]
      : mainProduct.variants.find(variant => variant.id === variantId)
    this.bigCommerceStoreCurrency = bigCommerceStoreCurrency
  }

  /**
   * @see {@link https://developer.shopgate.com/docs/references/shopgate-pipelines/product-pipelines/getproduct-v1}
   * @returns {ShopgateProduct}
   */
  build () {
    return new ShopgateProduct({
      id: this._getId(),
      active: this._isActive(),
      availability: this._getAvailablity(),
      identifiers: this._getIdentifiers(),
      name: this._getName(),
      stock: this._getStock(),
      rating: this._getRating(),
      manufacturer: '',
      ageRating: 0,
      featuredImageUrl: this._getFeaturedImageUrl(),
      price: this._getPrice(),
      flags: this._getFlags(),
      highlight: this._getHighlight(),
      liveshoppings: this._getLiveShoppings(),
      parent: this._getParent(),
      characteristics: this._getCharacteristics(),
      type: this._getType(),
      tags: this._getTags()
    })
  }

  /**
   * @returns {boolean}
   *
   * @private
   */
  _isActive () {
    return this._isAtLeatOneVariantPurchasable()
  }

  /**
   * @param {BigCommerceProductVariant[]} variants
   * @returns {boolean}
   *
   * @private
   */
  _isAtLeatOneVariantPurchasable () {
    let variants = this.mainProduct.variants
    let size = variants.length
    for (let i = 0; i < size; ++i) {
      if (!variants[i].purchasing_disabled) {
        return true
      }
    }

    return false
  }

  /**
   * @returns {ShopgateProductAvailability}
   *
   * @private
   */
  _getAvailablity () {
    return {
      text: this._isVariant() && this.variant.purchasing_disabled
        ? this.variant.purchasing_disabled_message
        : this.mainProduct.availability_description,
      state: this.mainProduct.availability !== BigCommerceProduct.Availability.DISABLED
        ? ShopgateAvailibility.OK
        : ShopgateAvailibility.ALERT
    }
  }

  /**
   * @returns {string}
   *
   * @private
   */
  _getId () {
    return this._isVariant()
      ? `${this.mainProduct.id}-${this.variant.id}`
      : this.mainProduct.id
  }

  /**
   * @returns {ShopgateProductIdentifiers}
   *
   * @private
   */
  _getIdentifiers () {
    const identifiers = {}

    if (this.mainProduct.sku) {
      identifiers.sku = this.mainProduct.sku
    }

    if (this.mainProduct.upc) {
      identifiers.upc = this.mainProduct.upc
    }

    if (this.mainProduct.gtin) {
      identifiers.gtin = this.mainProduct.gtin
    }

    if (this.mainProduct.mpn) {
      identifiers.mpn = this.mainProduct.mpn
    }

    return identifiers
  }

  /**
   * @returns {string}
   *
   * @private
   */
  _getType () {
    let type = ShopgateProductType.SIMPLE
    if (this._isVariant()) {
      type = ShopgateProductType.VARIANT
    } else if (this.mainProduct.variants.length > 1) {
      type = ShopgateProductType.PARENT
    }
    return type
  }

  /**
   * Characteristics for the time this product is a variant
   *
   * @returns {ShopgateProductCharacteristics[]}
   *
   * @private
   */
  _getCharacteristics () {
    return []
  }

  /**
   * @returns {ShopgateProductLiveShoppings|null}
   *
   * @private
   */
  _getLiveShoppings () {
    return null
  }

  /**
   * @returns {ShopgateProductStock}
   *
   * @private
   */
  _getStock () {
    return {
      info: '',
      orderable: this._isPurchasable(),
      quantity: this._getQty(),
      ignoreQuantity: this._getIgnoreQty(),
      minOrderQuantity: this.mainProduct.order_quantity_minimum,
      maxOrderQuantity: this.mainProduct.order_quantity_maximum
    }
  }

  /**
   * Whether the quantity tracking should be ignored
   *
   * @return {boolean}
   *
   * @private
   */
  _getIgnoreQty () {
    return this.mainProduct.inventory_tracking === BigCommerceProduct.Inventory.TRACKING_OFF
  }

  /**
   * @returns {boolean}
   *
   * @private
   */
  _isPurchasable () {
    return this._isVariant()
      ? !this.variant.purchasing_disabled
      : this._isAtLeatOneVariantPurchasable(this.mainProduct.variants)
  }

  /**
   * @returns {ShopgateProductRating}
   *
   * @private
   */
  _getRating () {
    const rating = {
      // count : 0,
      reviewCount: this.mainProduct.reviews_count
    }

    if (this.mainProduct.reviews_count > 0) {
      rating.average = this.mainProduct.reviews_rating_sum
    }

    return rating
  }

  /**
   * @returns {string}
   *
   * @private
   */
  _getFeaturedImageUrl () {
    let image = this._isVariant() ? this.variant.image_url : ''

    if (typeof image === 'undefined' || image === '') {
      if (this.mainProduct.hasOwnProperty('images') && this.mainProduct.images.length > 0) {
        image = this.mainProduct.images[0].url_standard
      }
    }

    return image
  }

  /**
   * @returns {ShopgateProductPrice}
   *
   * @private
   * */
  _getPrice () {
    const prices = {
      tiers: [],
      info: '',
      unitPrice: this._getProduct().calculated_price,
      // unitPriceMin: 5,
      // unitPriceMax: 20,
      unitPriceNet: this._getProduct().calculated_price,
      unitPriceWithTax: this._getProduct().calculated_price,
      taxAmount: 0.00,
      taxPercent: 19.00,
      currency: this.bigCommerceStoreCurrency
    }

    if (
      this._getProduct().price !== this._getProduct().calculated_price &&
      this._getProduct().price > this._getProduct().calculated_price
    ) {
      prices.unitPriceStriked = this._getProduct().price
    }

    /**
     * Retail price is located on the mainProduct only
     */
    if (this.mainProduct.retail_price > 0) {
      prices.msrp = this.mainProduct.retail_price
    }

    return prices
  }

  /**
   * @returns {ShopgateProductFlags}
   *
   * @private
   */
  _getFlags () {
    return {
      hasChildren: false,
      hasVariants: !this._isVariant() && this.mainProduct.variants.length > 1,
      hasOptions: false
    }
  }

  /**
   * @returns {boolean}
   *
   * @private
   */
  _getHighlight () {
    return this.mainProduct.is_featured
  }

  /**
   * @returns {ShopgateProductDefinition}
   *
   * @private
   */
  _getParent () {
    return {}
  }

  /**
   * @returns {string}
   *
   * @private
   */
  _getTags () {
    return this.mainProduct.search_keywords
  }

  /**
   * @return {string}
   *
   * @private
   */
  _getName () {
    return this.mainProduct.name
  }

  /**
   * @return {number} - only integers are supported
   *
   * @private
   */
  _getQty () {
    return this._getProduct().inventory_level
  }

  /**
   * @returns {boolean}
   *
   * @private
   */
  _isVariant () {
    return this.variantId !== 0
  }

  /**
   * @returns {BigCommerceProduct|BigCommerceProductVariant}
   *
   * @private
   */
  _getProduct () {
    return this._isVariant() ? this.variant : this.mainProduct
  }
}

module.exports = ShopgateProductBuilder
