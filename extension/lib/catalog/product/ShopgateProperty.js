/**
 * @property {string} _label
 * @property {string} _value
 */
class ShopgateProperty {
  /**
   * @param {string} label
   * @param {string} value
   */
  constructor (label, value) {
    this._label = label
    this._value = value
  }

  /**
   * @returns {string}
   */
  get label () {
    return this._label
  }

  /**
   * @returns {string}
   */
  get value () {
    return this._value
  }
}

module.exports = ShopgateProperty
