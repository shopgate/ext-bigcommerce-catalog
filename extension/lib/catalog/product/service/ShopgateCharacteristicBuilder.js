class ShopgateCharacteristicBuilder {
  /**
   * @param {BigCommerceProductVariant[]} variants
   * @param {boolean} trackVariantInventory
   */
  constructor (variants, trackVariantInventory) {
    this.variants = variants
    this.trackQty = trackVariantInventory
  }

  /**
   * Builds all possible variations / characteristics
   * from the variants passed down
   *
   * @returns {Object[]}
   */
  build () {
    let list = {}
    this.variants.forEach(variant => {
      if (variant.purchasing_disabled || this._isOutOfStock(variant)) {
        return // skip disabled variants
      }
      variant.option_values.forEach(option => {
        if (!(option.option_id in list)) {
          list[option.option_id] = {
            id: option.option_id,
            label: option.option_display_name,
            values: {}
          }
        }
        if (!(option.id in list[option.option_id].values)) {
          list[option.option_id].values[option.id] = {
            id: option.id,
            label: option.label
          }
        }

        return option
      })
    })

    return Object.values(list).map((option) => {
      option.values = Object.values(option.values)
      return option
    })
  }

  /**
   * Check if the current variant is out of stock
   *
   * @param {BigCommerceProductVariant} variant
   * @returns {boolean}
   *
   * @private
   */
  _isOutOfStock (variant) {
    return this.trackQty ? variant.inventory_level <= 0 : false
  }
}

module.exports = ShopgateCharacteristicBuilder
