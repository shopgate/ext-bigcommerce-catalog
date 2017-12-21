const ProductShippingRepository = require('../catalog/product/repository/ShopgateShippingRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const BigCommerceProductEntityFactory = require('../catalog/product/BigCommerceEntityFactory')

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

  const bigCommerceStoreConfigurationRepository = new BigCommerceConfigurationRepository(
    bigCommerceFactory.createV2()
  )
  const bigCommerceProductEntityFactory = new BigCommerceProductEntityFactory(bigCommerceStoreConfigurationRepository)

  const productShippingRepository = new ProductShippingRepository(bigCommerceFactory.createV3(), bigCommerceProductEntityFactory)

  try {
    const productShipping = await productShippingRepository.get(input.productId)

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProductShipping_v1.')
    context.log.debug('Result: ' + JSON.stringify(productShipping))

    cb(null, {shipping: productShipping})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProductShipping_v1 with productId: ' + input.productId, error)
    cb(error)
  }
}
