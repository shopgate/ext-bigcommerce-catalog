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
  constructor (bigCommerceApi, bigCommerProduct) {
    this.bigCommerceApi = bigCommerceApi
    this.bigCommerceProduct = bigCommerProduct
    this.bigCommerceVariant = bigCommerProduct.variants[0]
  }

  /**
   * @returns {boolean}
   */
  isActive () {
    return this.bigCommerceProduct.is_visible && !this.isAtLeatOneVariantPurchasable(this.bigCommerceProduct.variants)
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
      identifiers['sku'] = this.bigCommerceProduct.sku
    }

    if (this.bigCommerceProduct.upc) {
      identifiers['sku'] = this.bigCommerceProduct.upc
    }

    return identifiers
  }

  getType () {
    return PRODUCT_TYPE_SIMPLE
  }

  async getBrand () {
    if (this.bigCommerceProduct.brand_id) {
      const data = await this.bigCommerceApi.get('/catalog/brands/' + this.bigCommerceProduct.brand_id)

      if (data.data.hasOwnProperty('name')) {
        return data.data.name
      }

      return ''
    }
  }

  getStock () {
    return {
      info: '',
      orderable: true,
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
    return {
      count: 10,
      average: this.bigCommerceProduct.reviews_rating_sum,
      reviewCount: this.bigCommerceProduct.reviews_count
    }
  }

  getFeaturedImageUrl () {
    return this.bigCommerceVariant.image_url
  }

  getPrice () {
    let prices = {
      tiers: [],
      info: '2€/Kg',
      unitPrice: this.bigCommerceProduct.calculated_price,
      //unitPriceMin: 5,
      //unitPriceMax: 20,
      unitPriceNet: this.bigCommerceProduct.calculated_price,
      unitPriceWithTax: 11.9,
      taxAmount: 2,
      taxPercent: 19.00,
      msrp: this.bigCommerceProduct.retail_price,
      currency: 'EUR'
    }

    if (
      this.bigCommerceProduct.price !== this.bigCommerceProduct.calculated_price &&
      this.bigCommerceProduct.price > this.bigCommerceProduct.calculated_price
    ) {
      prices['unitPriceStriked'] = this.bigCommerceProduct.price
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
    return false
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
