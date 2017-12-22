class ParentCategoryInformation {
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
   * @return {ShopgateParentCategoryInformation}
   */
  toShopgateParentCategory () {
    return {
      id: this.id,
      name: this.name
    }
  }
}

module.exports = ParentCategoryInformation
