const ProductRepository = require('../catalog/product/repository/ShopgateProductRepository')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const BigCommerceBrandRepository = require('../catalog/product/repository/BigCommerceBrandRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {GetProductInput} input
 * @returns {Promise<ShopgateProduct>}
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
    const product = await productRepository.get(input.productId)

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProduct_v1.')
    context.log.debug('Result: ' + JSON.stringify(product))

    return product
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProduct_v1 with productId: ' + input.productId, error)
    throw error
  } finally {
    apiTimings.report(bigCommerceApiVersion2.timings)
    apiTimings.report(bigCommerceApiVersion3.timings)
  }
}
