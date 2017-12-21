const ProductPropertiesRepository = require('../catalog/product/repository/ShopgatePropertiesRepository')
const BigCommerceFactory = require('./BigCommerceFactory')

/**
 * @param {Object} context
 * @param {GetProductPropertiesInput} input
 * @param {GetProductPropertiesCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )

  const productPropertiesRepository = new ProductPropertiesRepository(bigCommerceFactory.createV3())
  try {
    const productProperties = await productPropertiesRepository.get(input.productId)
    cb(null, {properties: productProperties})
  } catch (error) {
    context.log.error('Unable to get product properties for ' + input.productId, error)
    cb(error)
  }
}
