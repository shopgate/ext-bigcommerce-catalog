const INVENTORY_TRACKING_OFF = 'none'
const INVENTORY_TRACKING_SKU = 'sku'

const AVAILABILITY_AVAILABLE = 'available'
const AVAILABILITY_DISABLED = 'disabled'
const AVAILABILITY_PREORDER = 'preorder'

const PRODUCT_TYPE_SIMPLE = 'simple'
const PRODUCT_TYPE_PARENT = 'parent'
const PRODUCT_TYPE_VARIANT = 'variant'

/**
 *
 * @type {module.BigCommerceProduct}
 */
module.exports = class BigCommerceProduct {
  constructor (bigCommerProduct) {
    this.bigCommerceProduct = bigCommerProduct
    this.bigCommerceVariant = bigCommerProduct.variants[0]
  }

  /**
   * @returns {boolean}
   */
  isActive () {
    // TODO: global setting don't show "When a product is out of stock"
    return true
  }

  isAtLeatOneVariantPurchasable (variants) {
    for (let i = 0; i < variants.length; ++i) {
      if (!variants[i].purchasing_disabled) {
        return true
      }
    }

    return false
  }

  getAvailablity () {
    return {
      text: this.bigCommerceVariant.purchasing_disabled ? this.bigCommerceVariant.purchasing_disabled_message : this.bigCommerceProduct.availability_description,
      state: (this.bigCommerceProduct.availability === AVAILABILITY_AVAILABLE || this.bigCommerceProduct.availability === AVAILABILITY_PREORDER ? 'ok' : 'alert')
    }
  }

  getId () {
    return this.bigCommerceProduct.id
  }

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

  getType () {
    return PRODUCT_TYPE_SIMPLE
  }

  getBrandId () {
    return this.bigCommerceProduct.brand_id
  }

  getStock () {
    return {
      info: '',
      orderable: this.isAtLeatOneVariantPurchasable(this.bigCommerceProduct.variants),
      quantity: this.getStockQuantity(),
      ignoreQuantity: this.bigCommerceProduct.inventory_tracking !== INVENTORY_TRACKING_OFF
    }
  }

  getStockQuantity () {
    return this.getMaximumStockQuantityForVariants(this.bigCommerceProduct.variants)
  }

  /**
   * @param {Array} variants
   */
  getMaximumStockQuantityForVariants (variants) {
    let maximumVariantStockQuantity = 0
    variants.forEach((variant) => {
      if (maximumVariantStockQuantity > variant.intenvoryLevel) {
        maximumVariantStockQuantity = variant.intenvoryLevel
      }
    })

    return maximumVariantStockQuantity
  }

  getRating () {
    let rating = {
      //count : 0,
      reviewCount: this.bigCommerceProduct.reviews_count
    }

    if (this.bigCommerceProduct.reviews_count > 0) {
      rating.average = this.bigCommerceProduct.reviews_rating_sum
    }

    return rating
  }

  getFeaturedImageUrl () {
    let bigCommerceProductImage = this.bigCommerceVariant.image_url

    if (typeof bigCommerceProductImage === 'undefined' || bigCommerceProductImage === '') {
      if (this.bigCommerceProduct.hasOwnProperty('images') && this.bigCommerceProduct.images.length > 0) {
        bigCommerceProductImage = this.bigCommerceProduct.images[0].url_standard
      }
    }

    return bigCommerceProductImage
  }

  getPrice () {
    let prices = {
      tiers: [],
      info: '',
      unitPrice: this.bigCommerceProduct.calculated_price,
      //unitPriceMin: 5,
      //unitPriceMax: 20,
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

  getFlags () {
    return {
      hasChildren: true,
      hasVariants: false,
      hasOptions: false
    }
  }

  getHighlight () {
    return this.bigCommerceProduct.is_featured
  }

  getParent () {
    return false
  }

  getTags () {
    return this.bigCommerceProduct.search_keywords
  }

  getName () {
    return this.bigCommerceProduct.name
  }
}
