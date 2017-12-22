const Category = require('../entity/Category')

class Shopgate {
  /**
   * @param {RepositoryCommand} bigCommerceRepositoryCommandFactory
   */
  constructor (bigCommerceRepositoryCommandFactory) {
    this._commandFactory = bigCommerceRepositoryCommandFactory
  }

  /**
   * @return Promise<Category[]>
   */
  async getRoot () {
    const bigcommerceCategories = await this._commandFactory.buildGetAllVisibleCategoriesByParentId(
      0,
      ['id', 'name', 'image_url']
    ).execute()

    const bigCommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
      bigcommerceCategories.map(category => category.id)
    ).execute()

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
    const bigCommerceCategories = await this._commandFactory.buildGetAllVisibleCategoriesByParentId(
      categoryId,
      ['id', 'parent_id', 'name', 'image_url']
    ).execute()

    const bigCommerceProductCounts = await this._commandFactory.buildGetProductCountsByCategoryIds(
      bigCommerceCategories.map(category => category.id)
    ).execute()

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
    const promiseResults = await Promise.all([
      this._commandFactory.buildGetCategoryById(categoryId).execute(),
      this._commandFactory.buildGetProductCountsByCategoryIds([categoryId]).execute(),
      this._commandFactory.buildGetChildCategoryCountByCategoryId(categoryId).execute()
    ])

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
    const promiseResults = await Promise.all([
      this._commandFactory.buildGetCategoryById(categoryId).execute(),
      this._commandFactory.buildGetProductCountsByCategoryIds([categoryId]).execute(),
      this._commandFactory.buildGetAllVisibleCategoriesByParentId(
        categoryId,
        ['id', 'parent_id', 'name', 'image_url']
      ).execute()
    ])

    return Category.fromBigcommerceCategory(
      promiseResults[0], // the category data itself
      promiseResults[1][0], // product count
      promiseResults[2].length, // child category count
      promiseResults[2].map(bigCommerceCategory => Category.fromBigcommerceCategory(bigCommerceCategory)) // child categories
    )
  }
}

module.exports = Shopgate
