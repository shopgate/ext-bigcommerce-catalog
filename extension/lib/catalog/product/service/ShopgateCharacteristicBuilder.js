class ShopgateCharacteristicBuilder {
  /**
   * @param {BigCommerceProductVariant[]} variants
   */
  constructor (variants) {
    this.variants = variants
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
      variant.option_values.forEach(option => {
        if (!(option.option_id in list)) {
          list[option.option_id] = {
            id: option.option_id.toString(),
            label: option.option_display_name,
            values: {}
          }
        }
        if (!(option.id in list[option.option_id].values)) {
          list[option.option_id].values[option.id] = {
            id: option.id.toString(),
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
}

module.exports = ShopgateCharacteristicBuilder
