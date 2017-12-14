/**
 * @property {BigCommerce} _apiVersion3Client
 * @property {number[]} _categoryIds
 */
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
    const productsPromises = []

    for (const categoryId of this._categoryIds) {
      productsPromises.push(
        this._apiVersion3Client.get('/catalog/products/?categories:in=' + categoryId + '&include_fields=id&limit=1')
      )
    }

    const products = await Promise.all(productsPromises)
    const productCounts = []
    for (const product of products) {
      productCounts.push(product.meta.pagination.total)
    }

    return productCounts
  }
}

module.exports = GetProductCountsByCategoryIds
