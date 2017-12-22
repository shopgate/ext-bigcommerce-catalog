class GetCategoryById {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {number} categoryId
   */
  constructor (apiVersion3Client, categoryId) {
    this._apiVersion3Client = apiVersion3Client
    this._categoryId = categoryId
  }

  /**
   * @return {Promise<BigCommerceCategory>}
   */
  async execute () {
    return (await this._apiVersion3Client.get('/catalog/categories/' + this._categoryId)).data
  }
}

module.exports = GetCategoryById
