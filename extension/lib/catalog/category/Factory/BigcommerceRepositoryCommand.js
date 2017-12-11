const GetAllVisibleCategoriesByParentId = require('../Repository/Command/GetAllVisibleCategoriesByParentId')
const GetProductCountsByCategoryIds = require('../Repository/Command/GetProductCountsByCategoryIds')
const GetCategoryById = require('../Repository/Command/GetCategoryById')

/**
 * @property {BigCommerceFactory} _bigCommerceFactory
 */
class BigcommerceRepositoryCommand {
  /**
   * @param {BigCommerceFactory} bigCommerceFactory
   */
  constructor (bigCommerceFactory) {
    this._bigCommerceFactory = bigCommerceFactory
  }

  /**
   * @param {number} parentId
   * @param {string[]} includeFields
   * @param {number} pageSize
   *
   * @return {GetAllVisibleCategoriesByParentId}
   */
  buildGetAllVisibleCategoriesByParentId (parentId = 0, includeFields = [], pageSize = 250) {
    return new GetAllVisibleCategoriesByParentId(
      this._bigCommerceFactory.createV3(),
      parentId,
      includeFields,
      pageSize
    )
  }

  /**
   * @param {number} categoryId
   *
   * @return {GetCategoryById}
   */
  buildGetCategoryById (categoryId) {
    return new GetCategoryById(this._bigCommerceFactory.createV3(), categoryId)
  }

  /**
   * @param {number[]} categoryIds
   *
   * @return {GetProductCountsByCategoryIds}
   */
  buildGetProductCountsByCategoryIds (categoryIds) {
    return new GetProductCountsByCategoryIds(this._bigCommerceFactory.createV3(), categoryIds)
  }
}

module.exports = BigcommerceRepositoryCommand
