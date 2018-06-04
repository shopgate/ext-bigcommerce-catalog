const VariantRepository = require('../catalog/product/repository/ShopgateVariantRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {GetProductInput} input
 * @returns {Promise<ShopgateProduct>}
 */
module.exports = async (context, input) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )

  const bigCommerceApiVersion3 = bigCommerceFactory.createV3()

  const apiTimings = new ApiTimings(context.log)

  const variantRepository = new VariantRepository(
    bigCommerceApiVersion3
  )

  try {
    const variantList = await variantRepository.get(Number.parseInt(input.productId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProductVariants_v1.')
    context.log.debug('Result: ' + JSON.stringify(variantList))

    return variantList
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProductVariants_v1 with productId: ' + input.productId, error)
    throw error
  } finally {
    apiTimings.report(bigCommerceApiVersion3.timings)
  }
}
