const ShopgateImageRepository = require('../catalog/product/repository/ShopgateImageRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {GetProductInput} input
 * @returns {Promise<ShopgateImages>}
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
  const bigCommerceApiVersion3 = bigCommerceFactory.createV3()
  const apiTimings = new ApiTimings(context.log)
  const imageRepository = new ShopgateImageRepository(bigCommerceApiVersion3)

  try {
    const images = await imageRepository.get(input.productId)

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProductImages.v1.')
    context.log.debug('Result: ' + JSON.stringify(images))

    return images
  } catch (error) {
    context.log.error(
      'Failed executing @shopgate/bigcommerce-catalog/getProductImages.v1 with productId: ' + input.productId,
      error
    )
    throw error
  } finally {
    apiTimings.report(bigCommerceApiVersion3.timings)
  }
}
