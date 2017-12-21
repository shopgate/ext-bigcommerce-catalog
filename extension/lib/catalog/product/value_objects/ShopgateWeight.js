/**
 * @property {number} _amount
 * @property {string} _unit
 */
class ShopgateWeight {
  /**
   * @param {number} amount
   * @param {string} unit
   */
  constructor (amount, unit) {
    this._amount = amount
    this._unit = unit
  }

  /**
   * @returns {number}
   */
  get amount () {
    return this._amount
  }

  /**
   * @returns {string}
   */
  get unit () {
    return this._unit
  }
}

module.exports = ShopgateWeight
