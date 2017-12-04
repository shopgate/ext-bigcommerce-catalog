const INVENTORY_TRACKING_OFF = 'none'
// const INVENTORY_TRACKING_SKU = 'sku'

const AVAILABILITY_AVAILABLE = 'available'
// const AVAILABILITY_DISABLED = 'disabled'
const AVAILABILITY_PREORDER = 'preorder'

const PRODUCT_TYPE_SIMPLE = 'simple'
// const PRODUCT_TYPE_PARENT = 'parent'
// const PRODUCT_TYPE_VARIANT = 'variant'

/**
 @typedef {Object} BigCommerceVariantDefinition
 @property {?string} bin_picking_number
 @property {?number} calculated_price
 @property {?number} calculated_weight
 @property {?number} cost_price
 @property {?number} depth
 @property {?number} fixed_cost_shipping_price
 @property {?string} gtin
 @property {?number} height
 @property {?number} id
 @property {?string} image_url
 @property {?number} inventory_level
 @property {?number} inventory_warning_level
 @property {?boolean} is_free_shipping
 @property {?string} mpn
 @property {?Array} option_values
 @property {?number} price
 @property {?number} product_id
 @property {?boolean} purchasing_disabled
 @property {?string} purchasing_disabled_message
 @property {?string} sku
 @property {?number} sku_id
 @property {?string} upc
 @property {?number} weight
 @property {?number} width
 */

/**
 @typedef {Object} BigCommerceImageDefinition
 @property {?boolean} is_thumbnail
 @property {?number} sort_order
 @property {?string} description
 @property {?number} id
 @property {?number} product_id
 @property {?string} image_file
 @property {?string} url_zoom
 @property {?string} url_standard
 @property {?string} url_thumbnail
 @property {?string} url_tiny
 @property {?string} date_modified
 */

/**
 @typedef {Object} BigCommerceProductDefinition
 @property {?string} availability
 @property {?string} availability_description
 @property {?number} base_variant_id
 @property {?string} bin_picking_number
 @property {?string} brand_id
 @property {?Array} bulk_pricing_rules
 @property {number} calculated_price
 @property {?Array} categories
 @property {?string} condition
 @property {?number} cost_price
 @property {?Object} custom_url
 @property {?boolean} is_customized
 @property {?string} url
 @property {?string} date_created
 @property {?string} date_modified
 @property {?number} depth
 @property {?string} description
 @property {?number} fixed_cost_shipping_price
 @property {?Array} gift_wrapping_options_list
 @property {?string} gift_wrapping_options_type
 @property {?string} gtin
 @property {number} height
 @property {?number} id
 @property {?BigCommerceImageDefinition[]} images
 @property {?number} inventory_level
 @property {?string} inventory_tracking
 @property {?number} inventory_warning_level
 @property {?boolean} is_condition_shown
 @property {?boolean} is_featured
 @property {?boolean} is_free_shipping
 @property {?boolean} is_preorder_only
 @property {?boolean} is_price_hidden
 @property {?boolean} is_visible
 @property {?string} layout_file
 @property {?string} meta_description
 @property {?Array} meta_keywords
 @property {?string} mpn
 @property {?string} name
 @property {?string} option_set_display
 @property {?number} option_set_id
 @property {?number} order_quantity_maximum
 @property {?number} order_quantity_minimum
 @property {?string} page_title
 @property {?string} preorder_message
 @property {?string} preorder_release_date
 @property {?number} price
 @property {?string} price_hidden_label
 @property {?string} product_tax_code
 @property {?number[]} related_products
 @property {?number} retail_price
 @property {?number} reviews_count
 @property {?number} reviews_rating_sum
 @property {?number} sale_price
 @property {?string} search_keywords
 @property {?string} sku
 @property {?number} sort_order
 @property {?number} tax_class_id
 @property {?number} total_sold
 @property {?string} type
 @property {?string} upc
 @property {?BigCommerceVariantDefinition[]} variants
 @property {?number} view_count
 @property {?string} warranty
 @property {?number} weight
 @property {?number} width
 /*

 /**
 * @type {module.BigCommerceProduct}
 */
module.exports = class BigCommerceProduct {
  /**
   * @param {BigCommerceProductDefinition} bigCommerProduct
   */
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

  /**
   * @param {BigCommerceVariantDefinition[]} variants
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
   * @returns {{text: string, state: string}}
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
   * @returns {{sku?: string, upc?: string}}
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
   * @returns {{info: string, orderable: boolean, quantity: number, ignoreQuantity: boolean}}
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
   * @param {BigCommerceVariantDefinition[]} variants
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
   * @returns {{reviewCount: number, average?: number}}
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
   * @returns {{tiers: Array, info: string, unitPrice: number, unitPriceNet: number, unitPriceWithTax: number, unitPriceStriked?: number, taxAmount: number, taxPercent: number, currency: string}}
   */
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
   * @returns {{hasChildren: boolean, hasVariants: boolean, hasOptions: boolean}}
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
