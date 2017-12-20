const ShopgateProductShipping = require('./ShopgateShipping')

class ShopgateShippingRepository {
  /**
   * @param {BigCommerce} bigCommerceApiV3Client
   * @param {BigCommerceProductEntityFactory} bigCommerceProductEntityFactory
   */
  constructor (bigCommerceApiV3Client, bigCommerceProductEntityFactory) {
    this._client = bigCommerceApiV3Client
    this._productEntityFactory = bigCommerceProductEntityFactory
  }

  /**
   * @1param {number} productId
   * @returns {Promise<ShopgateProductShipping>}
   */
  async get (productId) {
    const response = await this._client.get('/catalog/products/' + productId + '?include_fields=fixed_cost_shipping_price,is_free_shipping')
    const productRepository = this._productEntityFactory.create(response.data)

    return new ShopgateProductShipping(
      productRepository.getShippingCost(),
      await productRepository.getShippingCostCurrency()
    )
  }
}

module.exports = ShopgateShippingRepository
