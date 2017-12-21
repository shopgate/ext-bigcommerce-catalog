const ProductDescriptionRepository = require('../catalog/product/repository/ShopgateDescriptionRepository.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')

/**
 * @param {Object} context
 * @param {GetProductDescriptionInput} input
 * @param {GetProductDescriptionCallback} cb
 */
module.exports = async (context, input, cb) => {
  if (!input.productId) {
    context.log.error('Get product description called with invalid arguments')
    cb(new Error('Invalid get product description call'))

    return
  }
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash)

  const productDescriptionRepository = new ProductDescriptionRepository(bigCommerceFactory.createV3())
  try {
    const descriptionResult = await productDescriptionRepository.get(input.productId)
    cb(null, {description: descriptionResult})
  } catch (error) {
    context.log.error(
      'Unable to get description for productId: ' + input.productId, error)
    cb(error)
  }
}
