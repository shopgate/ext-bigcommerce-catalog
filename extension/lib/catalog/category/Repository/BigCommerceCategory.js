const ShopgateCategory = require('../Entity/ShopgateCategory')

class BigCommerceCategory {
  /**
   * @param {BigCommerceRepositoryCommand} bigCommerceRepositoryCommandFactory
   */
  constructor (bigCommerceRepositoryCommandFactory) {
    this._commandFactory = bigCommerceRepositoryCommandFactory
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

    const bigCommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
      shopgateCategories.map(category => Number.parseInt(category.id))
    ).execute()

    for (let i = 0; i < shopgateCategories.length; i++) {
      shopgateCategories[i].productCount = bigCommerceProductCounts[i]
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

    const bigCommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
      shopgateCategories.map(category => Number.parseInt(category.id))
    ).execute()

    for (let i = 0; i < shopgateCategories.length; i++) {
      shopgateCategories[i].productCount = bigCommerceProductCounts[i]
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
      this._commandFactory.buildGetAllVisibleCategoriesByParentId(
        categoryId,
        ['id', 'parent_id', 'name', 'image_url']
      ).execute()
    ])

    return ShopgateCategory.fromBigcommerceCategory(
      promiseResults[0], // the category data itself
      promiseResults[1][0], // product count
      promiseResults[2].length, // child category count
      this._buildShopgateCategories(promiseResults[2]) // child categories
    ).toShopgateCategory()
  }

  /**
   * @param {BigCommerceCategory[]} bigCommerceCategories
   *
   * @return {ShopgateRootCategory[]}
   *
   * @private
   */
  _buildShopgateRootCategories (bigCommerceCategories) {
    const resultCategories = []

    for (const bigCommerceCategory of bigCommerceCategories) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigCommerceCategory).toShopgateRootCategory())
    }

    return resultCategories
  }

  /**
   * @param {BigCommerceCategory[]} bigCommerceCategories
   *
   * @return {ShopgateCategoryChild[]}
   *
   * @private
   */
  _buildShopgateChildCategories (bigCommerceCategories) {
    const resultCategories = []

    for (const bigCommerceCategory of bigCommerceCategories) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigCommerceCategory).toShopgateChildCategory())
    }
    return resultCategories
  }

  /**
   * @param bigCommerceCategories
   *
   * @return {ShopgateCategory[]}
   *
   * @private
   */
  _buildShopgateCategories (bigCommerceCategories) {
    const resultCategories = []

    for (const bigCommerceCategory of bigCommerceCategories) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigCommerceCategory).toShopgateCategory())
    }
    return resultCategories
  }
}

module.exports = BigCommerceCategory
