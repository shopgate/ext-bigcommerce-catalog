/**
 * @property {BigCommerce} _apiVersion3Client
 * @property {number} _categoryId
 */
class GetCategoryById {
  /**
   * @param {BigCommerce} apiVersion2Client
   * @param {number} categoryId
   */
  constructor (apiVersion2Client, categoryId) {
    this._apiVersion2Client = apiVersion2Client
    this._categoryId = categoryId
  }

  /**
   * @return {BigcommerceCategory}
   */
  async execute () {
    return (await this._apiVersion2Client.get('/catalog/categories/' + this._categoryId)).data
  }
}

module.exports = GetCategoryById
