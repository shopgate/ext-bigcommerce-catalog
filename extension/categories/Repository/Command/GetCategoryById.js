class GetCategoryById {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this._apiVersion3Client = apiVersion3Client
    this._categoryId = null
  }

  /**
   * @param {number} value
   */
  set categoryId (value) {
    this._categoryId = value
  }

  /**
   * @return {BigcommerceCategory}
   */
  async execute () {
    return (await this._apiVersion3Client.get('/catalog/categories/' + this._categoryId)).data
  }
}

module.exports = GetCategoryById
