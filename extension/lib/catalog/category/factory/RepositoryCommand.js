const GetAllVisibleCategoriesByParentId = require('../repository/command/GetAllVisibleCategoriesByParentId')
const GetProductCountsByCategoryIds = require('../repository/command/GetProductCountsByCategoryIds')
const GetCategoryById = require('../repository/command/GetCategoryById')
const GetChildCategoryCountCategoryIds = require('../repository/command/GetChildCategoryCountByCategoryId')

class RepositoryCommand {
  /**
   * @param {BigCommerce} bigCommerceClientV3
   */
  constructor (bigCommerceClientV3) {
    this._bigCommerceClientV3 = bigCommerceClientV3
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
      this._bigCommerceClientV3,
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
    return new GetCategoryById(this._bigCommerceClientV3, categoryId)
  }

  /**
   * @param {number[]} categoryIds
   *
   * @return {GetProductCountsByCategoryIds}
   */
  buildGetProductCountsByCategoryIds (categoryIds) {
    return new GetProductCountsByCategoryIds(this._bigCommerceClientV3, categoryIds)
  }

  /**
   * @param {number} categoryId
   *
   * @return {GetChildCategoryCountByCategoryId}
   */
  buildGetChildCategoryCountByCategoryId (categoryId) {
    return new GetChildCategoryCountCategoryIds(this._bigCommerceClientV3, categoryId)
  }
}

module.exports = RepositoryCommand
