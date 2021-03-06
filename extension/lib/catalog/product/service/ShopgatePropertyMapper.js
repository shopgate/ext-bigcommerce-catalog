const ShopgateProperty = require('../entity/ShopgateProperty')

class ShopgatePropertyMapper {
  /**
   * @param {ShopgateWeight} weight
   * @returns {ShopgateProperty[]}
   */
  static mapWeight (weight) {
    return [
      new ShopgateProperty(
        'Weight',
        String(weight.amount)
      ),
      new ShopgateProperty('Weight unit', weight.unit)
    ]
  }
}

module.exports = ShopgatePropertyMapper
