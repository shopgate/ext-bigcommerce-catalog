const ShopgateCategory = require('../Entity/ShopgateCategory')

class BigcommerceCategory {
  /**
   * @param {GetAllVisibleCategoriesByParentId} getAllCategories
   * @param {GetCategoryById} getCategoryById
   * @param {GetProductCountsByCategoryIds} getProductCountsByCategoryIds
   */
  constructor (getAllCategories, getCategoryById, getProductCountsByCategoryIds) {
    this._getAllCategories = getAllCategories
    this._getCategoryById = getCategoryById
    this._getProductCountsByCategoryIds = getProductCountsByCategoryIds
  }

  /**
   * @return Promise<ShopgateRootCategory[]>
   */
  async getRootCategories () {
    this._getAllCategories.parentId = 0
    this._getAllCategories.includeFields = ['id', 'name', 'image_url']
    let shopgateCategories = this._buildShopgateRootCategories(await this._getAllCategories.execute())

    this._getProductCountsByCategoryIds.categoryIds = shopgateCategories.map(category => category.id)
    let bigcommerceProductCounts = await this._getProductCountsByCategoryIds.execute()

    for (let i = 0; i < shopgateCategories.length; i++) {
      shopgateCategories[i].productCount = bigcommerceProductCounts[i].count
    }

    return shopgateCategories
  }

  /**
   * @param {number} categoryId
   *
   * @return ShopgateCategory[]
   */
  async getCategoryChildren (categoryId) {
    this._getAllCategories.parentId = categoryId
    this._getAllCategories.includeFields = ['id', 'parent_id', 'name', 'image_url']
    let shopgateCategories = this._buildShopgateRootCategories(await this._getAllCategories.execute())

    this._getProductCountsByCategoryIds.categoryIds = shopgateCategories.map(category => category.id)
    let bigcommerceProductCounts = await this._getProductCountsByCategoryIds.execute()

    for (let i = 0; i < shopgateCategories.length; i++) {
      shopgateCategories[i].productCount = bigcommerceProductCounts[i].count
    }

    return shopgateCategories
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

  /**
   * @param {BigcommerceCategory[]} bigcommerceCategories
   *
   * @return {ShopgateRootCategory[]}
   *
   * @private
   */
  _buildShopgateRootCategories (bigcommerceCategories) {
    let resultCategories = []

    for (let bigcommerceCategory of bigcommerceCategories) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigcommerceCategory).toShopgateRootCategory())
    }

    return resultCategories
  }

  /**
   * @param {BigcommerceCategory[]} bigcommerceCategories
   *
   * @return {ShopgateCategoryChild[]}
   *
   * @private
   */
  _buildShopgateChildCategories (bigcommerceCategories) {
    // these happen to be the same as ShopgateRootCategory as of 2017-12-07:
    return this._buildShopgateRootCategories(bigcommerceCategories)
  }
}

module.exports = BigcommerceCategory
