const BigCommerceProductRepository = require('./BigCommerceRepository')

class BigCommerceProductRepositoryFactory {
  /**
   * @param {BigCommerceProduct} bigCommerceProduct
   * @returns {BigCommerceProductRepository}
   */
  create (bigCommerceProduct) {
    return new BigCommerceProductRepository(bigCommerceProduct)
  }
}

module.exports = BigCommerceProductRepositoryFactory
