const ProductShippingRepository = require('../catalog/product/repository/ShopgateShippingRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const BigCommerceProductEntityFactory = require('../catalog/product/factory/BigCommerceEntityFactory')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {GetProductShippingInput} input
 * @param {GetProductShippingCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )
  const bigCommerceClientV2 = bigCommerceFactory.createV2()
  const bigCommerceClientV3 = bigCommerceFactory.createV3()
  const apiTimings = new ApiTimings(context.log, 'getProductShipping_v1')
  const bigCommerceStoreConfigurationRepository = new BigCommerceConfigurationRepository(
    bigCommerceClientV2
  )
  const bigCommerceProductEntityFactory = new BigCommerceProductEntityFactory(bigCommerceStoreConfigurationRepository)

  const productShippingRepository = new ProductShippingRepository(bigCommerceClientV3, bigCommerceProductEntityFactory)

  try {
    const productShipping = await productShippingRepository.get(Number.parseInt(input.productId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProductShipping_v1.')
    context.log.debug('Result: ' + JSON.stringify(productShipping))

    cb(null, {shipping: productShipping})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProductShipping_v1 with productId: ' + input.productId, error)
    cb(error)
  } finally {
    apiTimings.report(bigCommerceClientV2.timings)
    apiTimings.report(bigCommerceClientV3.timings)
  }
}
