/**
 * @property {BigCommerce} _apiVersion2Client
 * @proptery {number[]} _categoryIds
 */
class GetProductCountsByCategoryIds {
  /**
   * @param {BigCommerce} apiVersion2Client
   * @param {number[]} categoryIds
   */
  constructor (apiVersion2Client, categoryIds) {
    this._apiVersion2Client = apiVersion2Client
    this._categoryIds = categoryIds
  }

  /**
   * @return {BigcommerceProductCount[]}
   */
  async execute () {
    let productCountPromises = []

    for (let categoryId of this._categoryIds) {
      productCountPromises.push(this._apiVersion2Client.get('/products/count/?category=' + categoryId))
    }

    return Promise.all(productCountPromises)
  }
}

module.exports = GetProductCountsByCategoryIds
