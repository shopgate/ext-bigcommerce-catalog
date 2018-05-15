const ShopgateProduct = require('../entity/ShopgateProduct.js')
const ShopgateAvailibility = require('../value_objects/ShopgateAvailability.js')
const BigCommerceProduct = require('../read_model/BigCommerceProduct.js')
const ShopgateProductType = require('../value_objects/ShopgateType.js')

class ShopgateProductBuilder {
  /**
   * @param {BigCommerceProduct} bigCommereProduct
   * @param {string} bigCommerceStoreCurrency
   */
  constructor (bigCommereProduct, bigCommerceStoreCurrency) {
    this.bigCommerceProduct = bigCommereProduct
    this.bigCommerceVariant = bigCommereProduct.variants[0]
    this.bigCommerceStoreCurrency = bigCommerceStoreCurrency
  }

  /**
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
    // TODO: global setting don't show "When a product is out of stock"
    return true
  }

  /**
   * @param {BigCommerceProductVariant[]} variants
   * @returns {boolean}
   *
   * @private
   */
  _isAtLeatOneVariantPurchasable (variants) {
    for (let i = 0; i < variants.length; ++i) {
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
      text: this.bigCommerceVariant.purchasing_disabled ? this.bigCommerceVariant.purchasing_disabled_message : this.bigCommerceProduct.availability_description,
      state: (this.bigCommerceProduct.availability === BigCommerceProduct.Availability.AVAILABLE || this.bigCommerceProduct.availability === BigCommerceProduct.Availability.PREORDER ? ShopgateAvailibility.OK : ShopgateAvailibility.ALERT)
    }
  }

  /**
   * @returns {string}
   *
   * @private
   */
  _getId () {
    return this.bigCommerceProduct.id + (this.bigCommerceVariant && this.bigCommerceVariant.id ? '-' + this.bigCommerceVariant.id : '')
  }

  /**
   * @returns {ShopgateProductIdentifiers}
   *
   * @private
   */
  _getIdentifiers () {
    const identifiers = {}

    if (this.bigCommerceProduct.sku) {
      identifiers.sku = this.bigCommerceProduct.sku
    }

    if (this.bigCommerceProduct.upc) {
      identifiers.upc = this.bigCommerceProduct.upc
    }

    if (this.bigCommerceProduct.gtin) {
      identifiers.gtin = this.bigCommerceProduct.gtin
    }

    if (this.bigCommerceProduct.mpn) {
      identifiers.mpn = this.bigCommerceProduct.mpn
    }

    return identifiers
  }

  /**
   * @returns {string}
   *
   * @private
   */
  _getType () {
    return ShopgateProductType.SIMPLE
  }

  /**
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
      orderable: this._isAtLeatOneVariantPurchasable(this.bigCommerceProduct.variants),
      quantity: this._getStockQuantity(),
      ignoreQuantity: this.bigCommerceProduct.inventory_tracking !== BigCommerceProduct.Inventory.TRACKING_OFF
    }
  }

  /**
   * @returns {number}
   *
   * @private
   */
  _getStockQuantity () {
    return this._getMaximumStockQuantityForVariants(this.bigCommerceProduct.variants)
  }

  /**
   * @param {BigCommerceProductVariant[]} variants
   *
   * @returns {number}
   *
   * @private
   */
  _getMaximumStockQuantityForVariants (variants) {
    let maximumVariantStockQuantity = 0

    variants.forEach(variant => {
      if (maximumVariantStockQuantity > variant.inventory_level) {
        maximumVariantStockQuantity = variant.inventory_level
      }
    })

    for (let variant in variants) {
      if (maximumVariantStockQuantity > variant.inventory_level) {
        maximumVariantStockQuantity = variant.inventory_level
      }
    }

    return maximumVariantStockQuantity
  }

  /**
   * @returns {ShopgateProductRating}
   *
   * @private
   */
  _getRating () {
    const rating = {
      // count : 0,
      reviewCount: this.bigCommerceProduct.reviews_count
    }

    if (this.bigCommerceProduct.reviews_count > 0) {
      rating.average = this.bigCommerceProduct.reviews_rating_sum
    }

    return rating
  }

  /**
   * @returns {string}
   *
   * @private
   */
  _getFeaturedImageUrl () {
    let bigCommerceProductImage = this.bigCommerceVariant.image_url

    if (typeof bigCommerceProductImage === 'undefined' || bigCommerceProductImage === '') {
      if (this.bigCommerceProduct.hasOwnProperty('images') && this.bigCommerceProduct.images.length > 0) {
        bigCommerceProductImage = this.bigCommerceProduct.images[0].url_standard
      }
    }

    return bigCommerceProductImage
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
      unitPrice: this.bigCommerceProduct.calculated_price,
      // unitPriceMin: 5,
      // unitPriceMax: 20,
      unitPriceNet: this.bigCommerceProduct.calculated_price,
      unitPriceWithTax: this.bigCommerceProduct.calculated_price,
      taxAmount: 0.00,
      taxPercent: 19.00,
      currency: this.bigCommerceStoreCurrency
    }

    if (
      this.bigCommerceProduct.price !== this.bigCommerceProduct.calculated_price &&
      this.bigCommerceProduct.price > this.bigCommerceProduct.calculated_price
    ) {
      prices.unitPriceStriked = this.bigCommerceProduct.price
    }

    if (this.bigCommerceProduct.retail_price > 0) {
      prices.msrp = this.bigCommerceProduct.retail_price
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
      hasChildren: true,
      hasVariants: false,
      hasOptions: false
    }
  }

  /**
   * @returns {boolean}
   *
   * @private
   */
  _getHighlight () {
    return this.bigCommerceProduct.is_featured
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
    return this.bigCommerceProduct.search_keywords
  }

  /**
   * @return {string}
   *
   * @private
   */
  _getName () {
    return this.bigCommerceProduct.name
  }
}

module.exports = ShopgateProductBuilder
