const ProductRepository = require('../catalog/product/repository/ShopgateProductRepository')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const BigCommerceBrandRepository = require('../catalog/product/repository/BigCommerceBrandRepository')
const BigCommerceFactory = require('./BigCommerceFactory')
const StoreLogger = require('../store/logger/StoreLogger')

/**
 * @param {LoggerContext} context
 * @param {GetProductInput} input
 * @param {GetProductCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )

  const bigCommerceApiVersion3 = bigCommerceFactory.createV3()
  const productRepository = new ProductRepository(
    bigCommerceApiVersion3,
    new BigCommerceConfigurationRepository(
      bigCommerceFactory.createV2()
    ),
    new BigCommerceBrandRepository(
      bigCommerceApiVersion3
    ),
    new StoreLogger(context)
  )

  try {
    const product = await productRepository.get(Number.parseInt(input.productId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProduct_v1.')
    context.log.debug('Result: ' + JSON.stringify(product))

    cb(null, product)
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProduct_v1 with productId: ' + input.productId, error)
    cb(error)
  }
}
