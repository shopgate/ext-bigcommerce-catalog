class ShopgateProductDescriptionRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {StoreLogger} storeLogger
   */
  constructor (apiVersion3Client, storeLogger) {
    this._apiVersion3Client = apiVersion3Client
    this._storeLogger = storeLogger
  }

  /**
   * @param {number} productId
   * @return {string}
   */
  async get (productId) {
    this._storeLogger.startTimmer()
    let dataDescription = (await this._apiVersion3Client.get(
      '/catalog/products/' + productId + '?include_fields=description'
    )).data.description
    this._storeLogger.logTime('get product description')

    return dataDescription
  }
}

module.exports = ShopgateProductDescriptionRepository
