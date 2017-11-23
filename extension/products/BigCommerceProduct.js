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
  }

  /**
   * @returns {boolean}
   */
  isActive () {
    return this.bigCommerceProduct.is_visible
  }

  getAvailablity () {
    return {
      text: this.bigCommerceProduct.availability_description,
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
      let data = await this.bigCommerceApi.get('/catalog/brands/' + this.bigCommerceProduct.brand_id)

      if (data.data.hasOwnProperty('name')) {
        return data.data.name
      }


      return new Promise((resolve, reject) => {
        resolve(brand)

        reject()
      })


      return ''
    }
  }

  getStock () {
    return {
      info: '',
      orderable: true,
      quantity: 12,
      ignoreQuantity: false
    }
  }

  getRating () {
    return {
      count: 10,
      average: this.bigCommerceProduct.reviews_rating_sum,
      reviewCount: this.bigCommerceProduct.reviews_count
    }
  }

  getFeaturedImageUrl () {
    return 'https://cdn3.bigcommerce.com/s-r5s844ad/images/stencil/500x659/products/90/308/HERO_NI_colette_123__74757.1446735324.jpg?c=2'
  }

  getPrice () {
    let prices = {
      tiers: [],
      info: '2€/Kg',
      unitPrice: this.bigCommerceProduct.calculcatedPrice,
      unitPriceMin: 5,
      unitPriceMax: 20,
      unitPriceNet: 10,
      unitPriceWithTax: 11.9,
      taxAmount: 2,
      taxPercent: 19.00,
      msrp: 40,
      currency: 'EUR'
    }

    if (
      this.bigCommerceProduct.price !== this.bigCommerceProduct.calculcatedPrice &&
      this.bigCommerceProduct.price > this.bigCommerceProduct.calculcatedPrice
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
