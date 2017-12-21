const ProductListRepository = require('../catalog/product/repository/ShopgateProductListRepository.js')
const ShopgateGetProducts = require('../catalog/product/ShopgateGetProducts.js')
const BigComerceFactory = require('./BigCommerceFactory.js')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')

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

  const productListRepository = new ProductListRepository(
    bigCommerceFactory.createV3(),
    new BigCommerceConfigurationRepository(
      bigCommerceFactory.createV2()
    )
  )

  if (getByProductIds) {
    try {
      const productResult = await productListRepository.getByProductIds(
        input.productIds,
        input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
        input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
      )
      cb(null, productResult)
    } catch (error) {
      context.log.error('Unable to get products for productIds: ' + input.productIds, error)
      cb(error)
    }
  }

  if (getByCategoryId) {
    try {
      const productResult = await productListRepository.getByCategoryId(
        input.categoryId,
        input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_LIMIT,
        input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
        input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
      )
      cb(null, productResult)
    } catch (error) {
      context.log.error('Unable to get products for categoryId: ' + input.categoryId, error)
      cb(error)
    }
  }
}
