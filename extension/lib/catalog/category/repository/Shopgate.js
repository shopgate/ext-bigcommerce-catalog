const Category = require('../entity/Category')

class Shopgate {
  /**
   * @param {RepositoryCommand} bigCommerceRepositoryCommandFactory
   * @param {StoreLogger} storeLogger
   */
  constructor (bigCommerceRepositoryCommandFactory, storeLogger) {
    this._commandFactory = bigCommerceRepositoryCommandFactory
    this._storeLogger = storeLogger
  }

  /**
   * @return Promise<Category[]>
   */
  async getRootCategories () {
    this._storeLogger.startTimmer()
    const bigcommerceCategories = await this._commandFactory.buildGetAllVisibleCategoriesByParentId(
      0,
      ['id', 'name', 'image_url']
    ).execute()
    this._storeLogger.logTime('get visible categories by parent id for getRootCategories')

    this._storeLogger.startTimmer()
    const bigCommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
      bigcommerceCategories.map(category => category.id)
    ).execute()
    this._storeLogger.logTime('get product counts by category ids for getRootCategories')

    return bigcommerceCategories.map((bigcommerceCategory, index) => {
      return Category.fromBigcommerceCategory(bigcommerceCategory, bigCommerceProductCounts[index])
    })
  }

  /**
   * @param {number} categoryId
   *
   * @return {Promise<Category[]>}
   */
  async getChildrenByParentId (categoryId) {
    this._storeLogger.startTimmer()
    const bigCommerceCategories = await this._commandFactory.buildGetAllVisibleCategoriesByParentId(
      categoryId,
      ['id', 'parent_id', 'name', 'image_url']
    ).execute()
    this._storeLogger.logTime('get all visible categories by parent id for getChildrenByParentId')

    this._storeLogger.startTimmer()
    const bigCommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
      bigCommerceCategories.map(category => category.id)
    ).execute()
    this._storeLogger.logTime('product counts by category ids for getChildrenByParentId')

    return bigCommerceCategories.map((bigcommerceCategory, index) => {
      return Category.fromBigcommerceCategory(bigcommerceCategory, bigCommerceProductCounts[index])
    })
  }

  /**
   * @param {number} categoryId
   *
   * @return {Promise<Category>}
   */
  async getById (categoryId) {
    this._storeLogger.startTimmer()
    const promiseResults = await Promise.all([
      this._commandFactory.buildGetCategoryById(categoryId).execute(),
      this._commandFactory.buildGetProductCountsByCategoryIds([categoryId]).execute(),
      this._commandFactory.buildGetChildCategoryCountByCategoryId(categoryId).execute()
    ])
    this._storeLogger.logTime('get category by id, product counts by category ids, and category count by category id for getById')
    return Category.fromBigcommerceCategory(
      promiseResults[0], // the category data itself
      promiseResults[1][0], // product count
      promiseResults[2] // child category count
    )
  }

  /**
   * @param {number} categoryId
   *
   * @return {Promise<Category>}
   */
  async getByIdWithChildren (categoryId) {
    this._storeLogger.startTimmer()
    const promiseResults = await Promise.all([
      this._commandFactory.buildGetCategoryById(categoryId).execute(),
      this._commandFactory.buildGetProductCountsByCategoryIds([categoryId]).execute(),
      this._commandFactory.buildGetAllVisibleCategoriesByParentId(
        categoryId,
        ['id', 'parent_id', 'name', 'image_url']
      ).execute()
    ])
    this._storeLogger.logTime('get category by id, product counts by category ids, and categories by parent id for getByIdWithChildren')

    return Category.fromBigcommerceCategory(
      promiseResults[0], // the category data itself
      promiseResults[1][0], // product count
      promiseResults[2].length, // child category count
      promiseResults[2].map(bigCommerceCategory => Category.fromBigcommerceCategory(bigCommerceCategory)) // child categories
    )
  }
}

module.exports = Shopgate
