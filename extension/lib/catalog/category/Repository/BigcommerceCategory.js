const ShopgateCategory = require('../Entity/ShopgateCategory')

class BigcommerceCategory {
  /**
   * @param {GetAllVisibleCategoriesByParentId} getAllCategories
   * @param {GetCategoryById} getCategoryById
   */
  constructor (getAllCategories, getCategoryById) {
    this._getAllCategories = getAllCategories
    this._getCategoryById = getCategoryById
  }

  /**
   * @return PromiseLike<ShopgateCategory[]>
   */
  async getRootCategories () {
    this._getAllCategories.parentId = 0
    this._getAllCategories.includeFields = ['id', 'parent_id', 'name', 'image_url']

    return this._buildShopgateCategories(await this._getAllCategories.execute())
  }

  /**
   * @param {number} categoryId
   *
   * @return ShopgateCategory[]
   */
  async getCategoryChildren (categoryId) {
    this._getAllCategories.parentId = categoryId
    this._getAllCategories.includeFields = ['id', 'parent_id', 'name', 'image_url']

    return this._buildShopgateCategories(await this._getAllCategories.execute())
  }

  /**
   * @param {number} categoryId
   *
   * @return ShopgateCategory
   */
  async getCategory (categoryId) {
    this._getCategoryById.categoryId = categoryId

    return ShopgateCategory.fromBigcommerceCategory(await this._getCategoryById.execute())
  }

  /**
   * @param {BigcommerceCategory[]} bigcommerceCategories
   *
   * @return ShopgateCategory[]
   *
   * @private
   */
  _buildShopgateCategories (bigcommerceCategories) {
    let resultCategories = []

    for (let bigcommerceCategory of bigcommerceCategories) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigcommerceCategory))
    }

    return resultCategories
  }
}

module.exports = BigcommerceCategory
