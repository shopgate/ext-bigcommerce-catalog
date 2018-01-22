const ProductRepository = require('../catalog/product/repository/ShopgateProductRepository')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const BigCommerceBrandRepository = require('../catalog/product/repository/BigCommerceBrandRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const ApiTimings = require('./BigCommerceTimings')

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

  const bigCommerceApiVersion3 = bigCommerceFactory.createV3()
  const bigCommerceApiVersion2 = bigCommerceFactory.createV2()

  const apiTimings = new ApiTimings(context.log)

  const productRepository = new ProductRepository(
    bigCommerceApiVersion3,
    new BigCommerceConfigurationRepository(
      bigCommerceApiVersion2
    ),
    new BigCommerceBrandRepository(
      bigCommerceApiVersion3
    )
  )

  try {
    const product = await productRepository.get(Number.parseInt(input.productId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProduct_v1.')
    context.log.debug('Result: ' + JSON.stringify(product))

    cb(null, product)
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProduct_v1 with productId: ' + input.productId, error)
    cb(error)
  } finally {
    apiTimings.report(bigCommerceApiVersion2.timings)
    apiTimings.report(bigCommerceApiVersion3.timings)
  }
}
