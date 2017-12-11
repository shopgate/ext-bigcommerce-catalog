/**
 * @property {BigCommerce} _apiVersion3Client
 * @proptery {number[]} _categoryIds
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
    let productsPromises = []

    for (let categoryId of this._categoryIds) {
      productsPromises.push(
        this._apiVersion3Client.get('/catalog/products/?categories:in=' + categoryId + '&include_fields=id&limit=1')
      )
    }

    const products = await Promise.all(productsPromises)
    let productCounts = []
    for (let product of products) {
      productCounts.push(product.meta.pagination.total)
    }

    return productCounts
  }
}

module.exports = GetProductCountsByCategoryIds
