const ProductShippingRepository = require('../catalog/product/ShopgateShippingRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const BigCommerceProductEntityFactory = require('../catalog/product/BigCommerceEntityFactory')

/**
 * @param {Object} context
 * @param {GetProductShippingInput} input
 * @param {GetProductShippingCallback} cb
 */
module.exports = async (context, input, cb) => {
  if (!input.hasOwnProperty('productId') || !parseInt(input.productId)) {
    context.log.error('Get product shipping called with invalid arguments')
    cb(new Error('Invalid get product shipping call'))

    return
  }

  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash)

  const bigCommerceStoreConfigurationRepository = new BigCommerceConfigurationRepository(
    bigCommerceFactory.createV2()
  )
  const bigCommerceProductEntityFactory = new BigCommerceProductEntityFactory(bigCommerceStoreConfigurationRepository)

  const productShippingRepository = new ProductShippingRepository(bigCommerceFactory.createV3(), bigCommerceProductEntityFactory)

  try {
    cb(null, { shipping: await productShippingRepository.get(input.productId) })
  } catch (error) {
    context.log.error('Unable to get product shipping for ' + input.productId, error)
    cb(error)
  }
}
