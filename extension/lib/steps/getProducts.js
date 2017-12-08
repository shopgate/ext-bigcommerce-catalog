const ProductListRepository = require('../../lib/catalog/ShopgateProductListRepository.js')
const ShopgateGetProducts = require('../catalog/product/ShopgateGetProducts.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')

/**
 * @param {Object} context
 * @param {GetProductsInput} input - Properties depend on the pipeline this is used for
 * @param {GetProductsPipelineCallback} cb
 */
module.exports = function (context, input, cb) {
  const getByCategoryId = input.hasOwnProperty('categoryId') && input.categoryId
  const getByProductIds = input.hasOwnProperty('productIds') && input.productIds

  if (!getByCategoryId && !getByProductIds) {
    cb(null, {
      totalProductCount: 0,
      products: []
    })
    return
  }

  const bigCommerceFactory = new BigCommerceFactory()
  const productListRepository = new ProductListRepository(bigCommerceFactory.createV3(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  ))

  if (getByProductIds) {
    productListRepository.getByProductIds(
      input.productIds,
      input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
      input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_OFFSET,
      input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
      input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
    ).then(productResult => {
      cb(null, productResult)
    }).catch(error => {
      context.log.error('Unable to get products for productIds: ' + input.productIds, error)
      cb(error)
    })
  }

  if (getByCategoryId) {
    productListRepository.getByCategoryId(
      input.categoryId,
      input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
      input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_LIMIT,
      input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
      input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
    ).then(productResult => {
      cb(null, productResult)
    }).catch(error => {
      context.log.error('Unable to get products for categoryId: ' + input.categoryId, error)
      cb(error)
    })
  }
}
