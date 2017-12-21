const ProductRepository = require('../catalog/product/repository/ShopgateProductRepository')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const BigCommerceFactory = require('./BigCommerceFactory')

/**
 * @param {Object} context
 * @param {GetProductInput} input
 * @param {GetProductCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )

  const productRepository = new ProductRepository(
    bigCommerceFactory.createV3(),
    new BigCommerceConfigurationRepository(
      bigCommerceFactory.createV2()
    )
  )

  try {
    cb(null, await productRepository.get(input.productId))
  } catch (error) {
    context.log.error('Unable to get product details for ' + input.productId, error)
    cb(error)
  }
}
