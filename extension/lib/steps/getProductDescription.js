const ProductDescriptionRepository = require('../catalog/product/repository/ShopgateDescriptionRepository.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const TimeLogger = require('../tools/TimeLogger')

/**
 * @param {Object} context
 * @param {GetProductDescriptionInput} input
 * @param {GetProductDescriptionCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )
  const bigCommerceClientV3 = bigCommerceFactory.createV3()
  const productDescriptionRepository = new ProductDescriptionRepository(bigCommerceClientV3)
  try {
    const productDescription = await productDescriptionRepository.get(Number.parseInt(input.productId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProductDescription_v1.')
    context.log.debug('Result: ' + JSON.stringify(productDescription))
    TimeLogger.log(bigCommerceClientV3.timeLogs, context)

    cb(null, {description: productDescription})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProductDescription_v1 with productId: ' + input.productId, error)

    cb(error)
  }
}
