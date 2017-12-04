const ShopgateParentCategoryInformation = require('../Entity/ShopgateParentCategoryInformation')

class ShopgateCategory {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} imageUrl
   * @param {ShopgateParentCategoryInformation} parent
   */
  constructor (id, name, imageUrl, parent) {
    this.id = id
    this.name = name
    this.imageUrl = imageUrl
    this.parent = parent
  }

  /**
   * @param {BigcommerceCategory} bigcommerceCategory
   * @return {ShopgateCategory}
   */
  static fromBigcommerceCategory (bigcommerceCategory) {
    return new this(
      bigcommerceCategory.id,
      bigcommerceCategory.name,
      bigcommerceCategory.image_url,
      new ShopgateParentCategoryInformation(
        bigcommerceCategory.parent_id,
        ''
      )
    )
  }
}

module.exports = ShopgateCategory
