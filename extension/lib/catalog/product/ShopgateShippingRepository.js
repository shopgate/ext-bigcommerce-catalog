const ShopgateProductShipping = require('./ShopgateShipping')

class ShopgateShippingRepository {
  /**
   * @param {BigCommerce} bigCommerceApiV3Client
   * @param {BigCommerceProductRepositoryFactory} bigCommerceProductRepositoryFactory
   */
  constructor (bigCommerceApiV3Client, bigCommerceProductRepositoryFactory) {
    this._client = bigCommerceApiV3Client
    this._productRepositoryFactory = bigCommerceProductRepositoryFactory
  }

  /**
   * @param {number} productId
   * @returns {Promise<ShopgateProductShipping>}
   */
  async get (productId) {
    const response = await this._client.get('/catalog/products/' + productId + '?include_fields=fixed_cost_shipping_price,is_free_shipping')
    const productRepository = this._productRepositoryFactory.create(response)

    return new ShopgateProductShipping(
      productRepository.getShippingCost(),
      await productRepository.getShippingCostCurrency()
    )
  }
}

module.exports = ShopgateShippingRepository
