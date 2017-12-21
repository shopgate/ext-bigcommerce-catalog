/**
 * @property {string} _id
 * @property {string} _name
 */
class ShopgateParentCategoryInformation {
  /**
   * @param {string} id
   * @param {string} name
   */
  constructor (id, name) {
    this._id = id
    this._name = name
  }

  /**
   * @returns {string}
   */
  get id () {
    return this._id
  }

  /**
   * @returns {string}
   */
  get name () {
    return this._name
  }

  /**
   * @returns {ShopgateParentCategoryInformation}
   */
  toShopgateParentCategory () {
    return {
      id: this.id,
      name: this.name
    }
  }
}

module.exports = ShopgateParentCategoryInformation
