const ShopgateProductShipping = require('../entity/ShopgateShipping')

class ShopgateShippingRepository {
  /**
   * @param {BigCommerce} bigCommerceApiV3Client
   * @param {BigCommerceProductEntityFactory} bigCommerceProductEntityFactory
   * @param {StoreLogger} storeLogger
   */
  constructor (bigCommerceApiV3Client, bigCommerceProductEntityFactory, storeLogger) {
    this._client = bigCommerceApiV3Client
    this._productEntityFactory = bigCommerceProductEntityFactory
    this._storeLogger = storeLogger
  }

  /**
   * @param {number} productId
   * @returns {Promise<ShopgateProductShipping>}
   */
  async get (productId) {
    this._storeLogger.startTimmer()
    const response = await this._client.get('/catalog/products/' + productId + '?include_fields=fixed_cost_shipping_price,is_free_shipping')
    this._storeLogger.logTime('get product shipping information')
    const productEntity = this._productEntityFactory.create(response.data)

    return new ShopgateProductShipping(
      productEntity.getShippingCost(),
      await productEntity.getShippingCostCurrency()
    )
  }
}

module.exports = ShopgateShippingRepository
