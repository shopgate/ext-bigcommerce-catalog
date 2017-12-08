/**
 * @property {BigCommerce} _apiVersion3Client
 * @property {number} _parentId
 * @property {string[]} _includeFields
 * @property {number} _pageSize
 */
class GetAllVisibleCategoriesByParentId {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {number} parentId
   * @param {string[]} includeFields
   * @param {number} pageSize
   */
  constructor (apiVersion3Client, parentId = 0, includeFields = [], pageSize = 250) {
    this._apiVersion3Client = apiVersion3Client
    this._parentId = parentId
    this._includeFields = includeFields
    this._pageSize = pageSize
  }

  /**
   * @return {BigcommerceCategory[]}
   */
  async execute () {
    const firstPage = await this._getFirstPage()
    const subsequentPages = await this._getSubsequentPages(firstPage.meta.pagination.total_pages)
    const allPages = [firstPage].concat(subsequentPages)

    let resultCategories = []
    for (let page of allPages) {
      Array.prototype.push.apply(resultCategories, page.data)
    }

    return resultCategories
  }

  /**
   * @return Promise<BigCommerceCategoryPage>
   *
   * @private
   */
  _getFirstPage () {
    return this._apiVersion3Client.get(
      '/catalog/categories?parent_id=' + this._parentId +
      '&limit=' + this._pageSize +
      '&is_visible=1' +
      '&include_fields=' + this._includeFields.join(',')
    )
  }

  /**
   * @param {number} totalPages
   *
   * @return Promise<BigcommerceCategoryPage>[]
   *
   * @private
   */
  async _getSubsequentPages (totalPages) {
    let pagePromises = []

    for (let pageCounter = 2; pageCounter < totalPages; pageCounter++) {
      pagePromises.push(
        this._apiVersion3Client.get(
          '/catalog/categories?parent_id=' + this._parentId +
          '&limit=' + this._pageSize +
          '&is_visible=1' +
          '&include_fields=' + this._includeFields.join(',') +
          '&page=' + pageCounter
        )
      )
    }

    return Promise.all(pagePromises)
  }
}

module.exports = GetAllVisibleCategoriesByParentId
