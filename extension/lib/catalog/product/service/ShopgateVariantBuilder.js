const ShopgateAvailibility = require('../value_objects/ShopgateAvailability.js')
const productModel = require('../read_model/BigCommerceProduct')

class ShopgateVariantBuilder {
  /**
   * @param {BigCommerceProduct} bigCommereProduct
   * @param {BigCommerceProductVariant} variant
   */
  constructor (bigCommereProduct, variant) {
    this.parent = bigCommereProduct
    this.variant = variant
  }

  /**
   * @see {@link https://developer.shopgate.com/docs/references/shopgate-pipelines/product-pipelines/product-properties/getproductvariants-v1}
   * @returns {Object}
   */
  build () {
    return {
      id: this._getId(),
      availability: this._getAvailablity(),
      stock: this._getStock(),
      hasOptions: false, // not supporting options here
      characteristics: this._getCharacteristics()
    }
  }

  /**
   * @returns {boolean}
   *
   * @private
   */
  _isVariantPurchasable () {
    return !this.variant.purchasing_disabled && (this._getQty() > 0 || this._getIgnoreQty())
  }

  /**
   * @returns {ShopgateProductAvailability}
   *
   * @private
   */
  _getAvailablity () {
    const stock = {
      text: this._isVariantPurchasable() ? this.parent.availability_description : this.variant.purchasing_disabled_message,
      state: ShopgateAvailibility.ALERT
    }
    if (this._isVariantPurchasable()) {
      stock.state = ShopgateAvailibility.OK
    } else if (this._isLowStock()) {
      stock.state = ShopgateAvailibility.WARNING
    }

    return stock
  }

  /**
   * @returns {boolean}
   *
   * @private
   */
  _isLowStock () {
    return this._getQty() <= this._getInventoryProduct().inventory_warning_level
  }

  /**
   * @returns {string}
   *
   * @private
   */
  _getId () {
    return this.parent.id + '-' + this.variant.id
  }

  /**
   * @returns {Object} - list of { option_id:option_selection_id, ...} pairs
   *
   * @private
   */
  _getCharacteristics () {
    const response = {}
    this.variant.option_values && this.variant.option_values.forEach((option) => {
      response[option.option_id] = option.id.toString()
    })
    return response
  }

  /**
   * @returns {ShopgateProductStock}
   *
   * @private
   */
  _getStock () {
    return {
      info: '',
      orderable: this._isVariantPurchasable(),
      quantity: this._getQty(),
      ignoreQuantity: this._getIgnoreQty(),
      minOrderQuantity: this.parent.order_quantity_minimum,
      maxOrderQuantity: this.parent.order_quantity_maximum
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
    return this.parent.inventory_tracking === productModel.Inventory.TRACKING_OFF
  }

  /**
   * Takes into account parent OR variant quantity
   *
   * @return {number} - only integers are supported
   *
   * @private
   */
  _getQty () {
    return this._getInventoryProduct().inventory_level
  }

  /**
   * Returns the correct product to calculate against
   * when doing inventory work
   *
   * @returns {boolean}
   *
   * @private
   */
  _getInventoryProduct () {
    return this.parent.inventory_tracking === productModel.Inventory.TRACKING_PRODUCT ? this.parent : this.variant
  }
}

module.exports = ShopgateVariantBuilder
