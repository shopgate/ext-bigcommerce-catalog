const ShopgateProduct = require('./entity/ShopgateProduct.js')

const INVENTORY_TRACKING_OFF = 'none'
// const INVENTORY_TRACKING_SKU = 'sku'

const AVAILABILITY_AVAILABLE = 'available'
// const AVAILABILITY_DISABLED = 'disabled'
const AVAILABILITY_PREORDER = 'preorder'

const PRODUCT_TYPE_SIMPLE = 'simple'
// const PRODUCT_TYPE_PARENT = 'parent'
// const PRODUCT_TYPE_VARIANT = 'variant'

/**
 * @type {module.ShopgateProductBuilder}
 */
module.exports = class ShopgateProductBuilder {
  /**
   * @param {BigCommerceApiProduct} bigCommerProduct
   */
  constructor (bigCommerProduct) {
    this.bigCommerceProduct = bigCommerProduct
    this.bigCommerceVariant = bigCommerProduct.variants[0]
  }

  /**
   * @returns {ShopgateProduct}
   */
  build () {
    return new ShopgateProduct({
      id: this.getId(),
      active: this.isActive(),
      availability: this.getAvailablity(),
      identifiers: this.getIdentifiers(),
      name: this.getName(),
      stock: this.getStock(),
      rating: this.getRating(),
      ageRating: 0,
      featuredImageUrl: this.getFeaturedImageUrl(),
      price: this.getPrice(),
      flags: this.getTags(),
      liveshoppings: [],
      highlight: this.getHighlight(),
      parent: this.getParent(),
      type: this.getType(),
      tags: this.getTags()
    })
  }

  /**
   * @returns {boolean}
   */
  isActive () {
    // TODO: global setting don't show "When a product is out of stock"
    return true
  }

  /**
   * @param {BigCommerceApiProductVariant[]} variants
   * @returns {boolean}
   */
  isAtLeatOneVariantPurchasable (variants) {
    for (let i = 0; i < variants.length; ++i) {
      if (!variants[i].purchasing_disabled) {
        return true
      }
    }

    return false
  }

  /**
   * @returns ShopgateProductAvailability
   */
  getAvailablity () {
    return {
      text: this.bigCommerceVariant.purchasing_disabled ? this.bigCommerceVariant.purchasing_disabled_message : this.bigCommerceProduct.availability_description,
      state: (this.bigCommerceProduct.availability === AVAILABILITY_AVAILABLE || this.bigCommerceProduct.availability === AVAILABILITY_PREORDER ? 'ok' : 'alert')
    }
  }

  /**
   * @returns {number}
   */
  getId () {
    return this.bigCommerceProduct.id
  }

  /**
   * @returns ShopgateProductIdentifiers
   */
  getIdentifiers () {
    let identifiers = {}

    if (this.bigCommerceProduct.sku) {
      identifiers.sku = this.bigCommerceProduct.sku
    }

    if (this.bigCommerceProduct.upc) {
      identifiers.upc = this.bigCommerceProduct.upc
    }

    return identifiers
  }

  /**
   * @returns {string}
   */
  getType () {
    return PRODUCT_TYPE_SIMPLE
  }

  /**
   * @returns {string}
   */
  getBrandId () {
    return this.bigCommerceProduct.brand_id
  }

  /**
   * @returns ShopgateProductStock
   */
  getStock () {
    return {
      info: '',
      orderable: this.isAtLeatOneVariantPurchasable(this.bigCommerceProduct.variants),
      quantity: this.getStockQuantity(),
      ignoreQuantity: this.bigCommerceProduct.inventory_tracking !== INVENTORY_TRACKING_OFF
    }
  }

  /**
   * @returns {number}
   */
  getStockQuantity () {
    return this.getMaximumStockQuantityForVariants(this.bigCommerceProduct.variants)
  }

  /**
   * @param {BigCommerceApiProductVariant[]} variants
   *
   * @returns {number}
   */
  getMaximumStockQuantityForVariants (variants) {
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
   * @returns ShopgateProductRating
   */
  getRating () {
    let rating = {
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
   */
  getFeaturedImageUrl () {
    let bigCommerceProductImage = this.bigCommerceVariant.image_url

    if (typeof bigCommerceProductImage === 'undefined' || bigCommerceProductImage === '') {
      if (this.bigCommerceProduct.hasOwnProperty('images') && this.bigCommerceProduct.images.length > 0) {
        bigCommerceProductImage = this.bigCommerceProduct.images[0].url_standard
      }
    }

    return bigCommerceProductImage
  }

  /**
   * @returns ShopgateProductPrice
   * */
  getPrice () {
    let prices = {
      tiers: [],
      info: '',
      unitPrice: this.bigCommerceProduct.calculated_price,
      // unitPriceMin: 5,
      // unitPriceMax: 20,
      unitPriceNet: this.bigCommerceProduct.calculated_price,
      unitPriceWithTax: this.bigCommerceProduct.calculated_price,
      taxAmount: 0.00,
      taxPercent: 19.00,
      currency: 'USD'
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
   * @returns ShopgateProductFlags
   */
  /* getFlags () {
    return {
      hasChildren: true,
      hasVariants: false,
      hasOptions: false
    }
  } */

  /**
   * @returns {boolean}
   */
  getHighlight () {
    return this.bigCommerceProduct.is_featured
  }

  /**
   * @returns {boolean}
   */
  getParent () {
    return false
  }

  /**
   * @returns {string}
   */
  getTags () {
    return this.bigCommerceProduct.search_keywords
  }

  /**
   * @return {string}
   */
  getName () {
    return this.bigCommerceProduct.name
  }
}
