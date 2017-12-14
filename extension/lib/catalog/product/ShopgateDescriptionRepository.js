class ShopgateProductDescriptionRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this.apiVersion3Client = apiVersion3Client
  }

  async get (productId) {
    const bigCommerceProductResponse = await this.apiVersion3Client.get(
      '/catalog/products/' + productId + '?include_fields=description')
    return bigCommerceProductResponse.data.description
  }
}
module.exports = ShopgateProductDescriptionRepository
