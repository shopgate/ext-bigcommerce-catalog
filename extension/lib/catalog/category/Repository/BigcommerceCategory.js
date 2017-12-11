const ShopgateCategory = require('../Entity/ShopgateCategory')

class BigcommerceCategory {
  /**
   * @param {BigcommerceRepositoryCommand} bigcommerceRepositoryCommandFactory
   */
  constructor (bigcommerceRepositoryCommandFactory) {
    this._commandFactory = bigcommerceRepositoryCommandFactory
  }

  /**
   * @return Promise<ShopgateRootCategory[]>
   */
  async getRootCategories () {
    let shopgateCategories = this._buildShopgateRootCategories(
      await this._commandFactory.buildGetAllVisibleCategoriesByParentId(
        0,
        ['id', 'name', 'image_url']
      ).execute()
    )

    let bigcommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
      shopgateCategories.map(category => Number.parseInt(category.id))
    ).execute()

    for (let i = 0; i < shopgateCategories.length; i++) {
      shopgateCategories[i].productCount = bigcommerceProductCounts[i]
    }

    return shopgateCategories
  }

  /**
   * @param {number} categoryId
   *
   * @return ShopgateCategory[]
   */
  async getCategoryChildren (categoryId) {
    let shopgateCategories = this._buildShopgateChildCategories(
      await this._commandFactory.buildGetAllVisibleCategoriesByParentId(
        categoryId,
        ['id', 'parent_id', 'name', 'image_url']
      ).execute()
    )

    let bigcommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
      shopgateCategories.map(category => Number.parseInt(category.id))
    ).execute()

    for (let i = 0; i < shopgateCategories.length; i++) {
      shopgateCategories[i].productCount = bigcommerceProductCounts[i]
    }

    return shopgateCategories
  }

  /**
   * @param {number} categoryId
   *
   * @return ShopgateCategory
   */
  async getCategory (categoryId) {
    return ShopgateCategory.fromBigcommerceCategory(
      await this._commandFactory.buildGetCategoryById(categoryId).execute()
    )
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
