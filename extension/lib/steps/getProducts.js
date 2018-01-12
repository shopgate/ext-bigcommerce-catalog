const ProductListRepository = require('../catalog/product/repository/ShopgateProductListRepository.js')
const BigCommerceBrandRepository = require('../catalog/product/repository/BigCommerceBrandRepository')
const ShopgateGetProducts = require('./configuration/GetProductsDefaultArguments')
const BigComerceFactory = require('./BigCommerceFactory.js')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const StoreLogger = require('../store/logger/StoreLogger')

/**
 * @param {Object} context
 * @param {GetProductsInput} input - Properties depend on the pipeline this is used for
 * @param {GetProductsPipelineCallback} cb
 */
module.exports = async (context, input, cb) => {
  const getByCategoryId = input.hasOwnProperty('categoryId') && input.categoryId
  const getByProductIds = input.hasOwnProperty('productIds') && input.productIds

  if (!getByCategoryId && !getByProductIds) {
    cb(null, {
      totalProductCount: 0,
      products: []
    })
    return
  }

  const bigCommerceFactory = new BigComerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )

  const BigCommerceApiVersion3 = bigCommerceFactory.createV3()
  const productListRepository = new ProductListRepository(
    BigCommerceApiVersion3,
    new BigCommerceConfigurationRepository(
      bigCommerceFactory.createV2()
    ),
    new BigCommerceBrandRepository(
      BigCommerceApiVersion3
    ),
    new StoreLogger(context)
  )

  if (getByProductIds) {
    try {
      const products = await productListRepository.getByProductIds(
        input.productIds,
        input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
        input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
      )

      context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProducts_v1.')
      context.log.debug('Result: ' + JSON.stringify(products))

      cb(null, products)
    } catch (error) {
      context.log.error('Failed executing @shopgate/bigcommerce-catalog/getProducts_v1 with parameters: ' + JSON.stringify(input), error)
      cb(error)
    }
  }

  if (getByCategoryId) {
    try {
      const products = await productListRepository.getByCategoryId(
        input.categoryId,
        input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_LIMIT,
        input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
        input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
      )

      context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProducts_v1.')
      context.log.debug('Result: ' + JSON.stringify(products))

      cb(null, products)
    } catch (error) {
      context.log.error('Unable to get products for categoryId: ' + input.categoryId, error)
      cb(error)
    }
  }
}
