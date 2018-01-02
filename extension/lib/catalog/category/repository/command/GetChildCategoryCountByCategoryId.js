class GetChildCategoryCountByCategoryId {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {number} categoryId
   */
  constructor (apiVersion3Client, categoryId) {
    this._apiVersion3Client = apiVersion3Client
    this._categoryId = categoryId
  }

  /**
   * @return {Promise<number>}
   */
  async execute () {
    const categories = await this._apiVersion3Client.get(
      '/catalog/categories/?parent_id=' + this._categoryId + '&is_visible=1&include_fields=id&limit=1'
    )

    return categories.meta.pagination.total
  }
}

module.exports = GetChildCategoryCountByCategoryId
