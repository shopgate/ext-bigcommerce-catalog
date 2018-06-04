class GetProductCountsByCategoryIds {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {number[]} categoryIds
   */
  constructor (apiVersion3Client, categoryIds) {
    this._apiVersion3Client = apiVersion3Client
    this._categoryIds = categoryIds
  }

  /**
   * @return {Promise<number[]>}
   */
  async execute () {
    return (await Promise.all(
      this._categoryIds.map(
        categoryId => this._apiVersion3Client.get('/catalog/products/?categories:in=' + categoryId + '&include_fields=id&limit=1')
      )
    )
    ).map(productsResult => productsResult.meta.pagination.total)
  }
}

module.exports = GetProductCountsByCategoryIds
