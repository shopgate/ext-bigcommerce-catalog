const ProductDescriptionRepository = require('../catalog/product/repository/ShopgateDescriptionRepository.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {GetProductDescriptionInput} input
 * @returns {Promise<ShopgateProductDescription>}
 */
module.exports = async (context, input) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash,
    {
      cacheLifetime: context.config.lifetime_sec,
      extensionStorage: context.storage.extension
    }
  )
  const bigCommerceClientV3 = bigCommerceFactory.createV3()
  const apiTimings = new ApiTimings(context.log)
  const productDescriptionRepository = new ProductDescriptionRepository(bigCommerceClientV3)
  try {
    const productDescription = await productDescriptionRepository.get(Number.parseInt(input.productId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProductDescription_v1.')
    context.log.debug('Result: ' + JSON.stringify(productDescription))

    return {description: productDescription}
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProductDescription_v1 with productId: ' + input.productId, error)

    throw error
  } finally {
    apiTimings.report(bigCommerceClientV3.timings)
  }
}
