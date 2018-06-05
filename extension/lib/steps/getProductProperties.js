const ProductPropertiesRepository = require('../catalog/product/repository/ShopgatePropertiesRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {GetProductPropertiesInput} input
 * @returns {Promise<ShopgateProductProperty>}
 */
module.exports = async (context, input) => {
  let cacheConfig = {}
  if (context.config.cache) {
    cacheConfig = {
      cacheLifetime: context.config.cache.lifetime_sec,
      extensionStorage: context.storage.extension
    }
  }
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash,
    cacheConfig
  )
  const bigCommerceClientV3 = bigCommerceFactory.createV3()
  const apiTimings = new ApiTimings(context.log)
  const productPropertiesRepository = new ProductPropertiesRepository(bigCommerceClientV3)
  try {
    const productProperties = await productPropertiesRepository.get(Number.parseInt(input.productId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProductProperties_v1.')
    context.log.debug('Result: ' + JSON.stringify(productProperties))

    return {properties: productProperties}
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProductProperties_v1 with productId: ' + input.productId, error)
    throw error
  } finally {
    apiTimings.report(bigCommerceClientV3.timings)
  }
}
