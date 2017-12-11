const ShopgateParentCategoryInformation = require('./ShopgateParentCategoryInformation')

/**
 * @property {string} id
 * @property {string} name
 * @property {string} imageUrl
 * @property {ShopgateParentCategoryInformation} parent
 * @property {number} productCount
 */
class ShopgateCategory {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} imageUrl
   * @param {ShopgateParentCategoryInformation|null} parent
   * @param {number} productCount
   */
  constructor (id, name, imageUrl, parent = null, productCount = 1) {
    this.id = id
    this.name = name
    this.imageUrl = imageUrl
    this.parent = parent
    this.productCount = productCount
  }

  /**
   * @param {BigcommerceCategory} bigcommerceCategory
   * @param {number} productCount
   *
   * @return {ShopgateCategory}
   */
  static fromBigcommerceCategory (bigcommerceCategory, productCount = 1) {
    let parentCategory
    if (bigcommerceCategory.hasOwnProperty('parent_id')) {
      parentCategory = new ShopgateParentCategoryInformation(bigcommerceCategory.parent_id.toString(), '')
    }

    return new this(
      bigcommerceCategory.id,
      bigcommerceCategory.name,
      bigcommerceCategory.image_url,
      parentCategory,
      productCount
    )
  }

  /**
   * @return {ShopgateRootCategory}
   */
  toShopgateRootCategory () {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl,
      productCount: this.productCount
    }
  }
}

module.exports = ShopgateCategory
