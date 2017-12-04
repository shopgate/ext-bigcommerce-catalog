class GetAllVisibleCategoriesByParentId {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this.apiVersion3Client = apiVersion3Client
    this._parentId = null
    this._includeFields = []
  }

  set parentId (value) {
    this._parentId = value
  }

  set includeFields (value) {
    this._includeFields = value
  }

  /**
   * @return {BigcommerceCategory[]}
   */
  async execute () {
    const firstPage = await this._getFirstPage()
    const subsequentPages = this._getSubsequentPages(firstPage.meta.pagination.total_pages)
    const allPages = await Promise.all([firstPage].concat(subsequentPages))

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
    return this.apiVersion3Client.get(
      '/catalog/categories?parent_id=' + this._parentId +
      '&limit=250' +
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
  _getSubsequentPages (totalPages) {
    let pagePromises = []

    for (let pageCounter = 2; pageCounter < totalPages; pageCounter++) {
      pagePromises.push(
        this.apiVersion3Client.get(
          '/catalog/categories?parent_id=' + this._parentId +
          '&limit=250' +
          '&is_visible=1' +
          '&include_fields=' + this._includeFields.join(',') +
          '&page=' + pageCounter
        )
      )
    }

    return pagePromises
  }
}

module.exports = GetAllVisibleCategoriesByParentId
