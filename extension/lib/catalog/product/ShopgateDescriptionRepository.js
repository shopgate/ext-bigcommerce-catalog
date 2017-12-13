class ShopgateProductDescriptionRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this.apiVersion3Client = apiVersion3Client
  }

  async get (productId) {
    const bcResponse = await this.apiVersion3Client.get('/catalog/products/' + productId + '?include_fields=description')
    if (!bcResponse.data.description) {
      throw new Error('A description was not returned')
    }
    return bcResponse.data.description
  }
}
module.exports = ShopgateProductDescriptionRepository
