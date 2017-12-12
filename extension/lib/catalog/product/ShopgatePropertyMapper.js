const ShopgateProperty = require('./ShopgateProperty')
class ShopgatePropertyMapper {
  /**
   * @param {ShopgateWeight} weight
   * @returns {ShopgateProperty[]}
   */
  static mapWeight (weight) {
    return [
      new ShopgateProperty(
        'Weight',
        weight.amount
      ),
      new ShopgateProperty('Weight unit', weight.unit)
    ]
  }
}

module.exports = ShopgatePropertyMapper
