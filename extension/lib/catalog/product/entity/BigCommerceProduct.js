class BigCommerceProductEntity {
  /**
   * @param {BigCommerceProduct} bigCommerceProduct
   * @param {BigCommerceRepository} bigCommerceStoreConfigurationRepository
   */
  constructor (bigCommerceProduct, bigCommerceStoreConfigurationRepository) {
    this._bigCommerceProduct = bigCommerceProduct
    this._bigCommerceStoreConfigurationRepository = bigCommerceStoreConfigurationRepository
  }

  /**
   * @returns {number}
   */
  getShippingCost () {
    const fixedShippingCostPerUnit = this._bigCommerceProduct.fixed_cost_shipping_price || 0

    return this._bigCommerceProduct.is_free_shipping ? 0 : fixedShippingCostPerUnit
  }

  /**
   * @returns {Promise<string>}
   */
  async getShippingCostCurrency () {
    return this._bigCommerceStoreConfigurationRepository.getCurrency()
  }
}

module.exports = BigCommerceProductEntity
