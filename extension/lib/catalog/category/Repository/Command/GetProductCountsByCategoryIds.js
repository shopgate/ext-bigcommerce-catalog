/**
 * @property {BigCommerce} _apiVersion2Client
 * @proptery {string[]} _categoryIds
 */
class GetProductCountsByCategoryIds {
  /**
   * @param {BigCommerce} apiVersion2Client
   */
  constructor (apiVersion2Client) {
    this._apiVersion2Client = apiVersion2Client
    this._categoryIds = []
  }

  /**
   * @param {string[]} value
   */
  set categoryIds (value) {
    this._categoryIds = value
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
