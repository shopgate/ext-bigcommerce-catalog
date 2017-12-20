const ProductPropertiesRepository = require('../catalog/product/ShopgatePropertiesRepository')
const BigCommerceFactory = require('./BigCommerceFactory')

/**
 * @param {Object} context
 * @param {GetProductPropertiesInput} input
 * @param {GetProductPropertiesCallback} cb
 */
module.exports = async (context, input, cb) => {
  if (!input.productId) {
    context.log.error('Get product details called with invalid arguments')
    cb(new Error('Invalid get product properties call'))

    return
  }

  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash)

  const productPropertiesRepository = new ProductPropertiesRepository(bigCommerceFactory.createV3())

  try {
    const productProperties = await productPropertiesRepository.get(
      input.productId)
    cb(null, {properties: productProperties})
  } catch (error) {
    context.log.error('Unable to get product properties for ' + input.productId, error)
    cb(error)
  }
}
