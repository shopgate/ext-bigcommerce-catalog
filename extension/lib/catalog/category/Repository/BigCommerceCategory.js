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
    const shopgateCategories = this._buildShopgateRootCategories(
      await this._commandFactory.buildGetAllVisibleCategoriesByParentId(
        0,
        ['id', 'name', 'image_url']
      ).execute()
    )

    const bigcommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
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
   * @return {Promise<ShopgateCategoryChild[]>}
   */
  async getCategoryChildren (categoryId) {
    const shopgateCategories = this._buildShopgateChildCategories(
      await this._commandFactory.buildGetAllVisibleCategoriesByParentId(
        categoryId,
        ['id', 'parent_id', 'name', 'image_url']
      ).execute()
    )

    const bigcommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
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
   * @return {Promise<ShopgateCategory>}
   */
  async getCategory (categoryId) {
    const promiseResults = await Promise.all([
      this._commandFactory.buildGetCategoryById(categoryId).execute(),
      this._commandFactory.buildGetProductCountsByCategoryIds([categoryId]).execute(),
      this._commandFactory.buildGetChildCategoryCountByCategoryId(categoryId).execute()
    ])

    return ShopgateCategory.fromBigcommerceCategory(
      promiseResults[0], // the category data itself
      promiseResults[1][0], // product count
      promiseResults[2] // child category count
    ).toShopgateCategory()
  }

  /**
   * @param {number} categoryId
   *
   * @return {Promise<ShopgateCategory>}
   */
  async getCategoryWithChildren (categoryId) {
    const promiseResults = await Promise.all([
      this._commandFactory.buildGetCategoryById(categoryId).execute(),
      this._commandFactory.buildGetProductCountsByCategoryIds([categoryId]).execute(),
      this._commandFactory.buildGetAllVisibleCategoriesByParentId(categoryId).execute()
    ])

    return ShopgateCategory.fromBigcommerceCategory(
      promiseResults[0], // the category data itself
      promiseResults[1][0], // product count
      promiseResults[2].length, // child category count
      this._buildShopgateCategories(promiseResults[2]) // child categories
    ).toShopgateCategory()
  }

  /**
   * @param {BigcommerceCategory[]} bigcommerceCategories
   *
   * @return {ShopgateRootCategory[]}
   *
   * @private
   */
  _buildShopgateRootCategories (bigcommerceCategories) {
    const resultCategories = []

    for (const bigcommerceCategory of bigcommerceCategories) {
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
    const resultCategories = []

    for (const bigcommerceCategory of bigcommerceCategories) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigcommerceCategory).toShopgateChildCategory())
    }
    return resultCategories
  }

  /**
   * @param bigcommerceCategories
   *
   * @return {ShopgateCategory[]}
   *
   * @private
   */
  _buildShopgateCategories (bigcommerceCategories) {
    const resultCategories = []

    for (const bigcommerceCategory of bigcommerceCategories) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigcommerceCategory).toShopgateCategory())
    }
    return resultCategories
  }
}

module.exports = BigcommerceCategory
