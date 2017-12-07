const BigCommerceApi = require('node-bigcommerce')
const ProductListRepository = require('../../lib/catalog/ShopgateProductListRepository.js')
const ShopgateGetProducts = require('../catalog/product/ShopgateGetProducts.js')

const productListRepository = new ProductListRepository(
  new BigCommerceApi({
    logLevel: 'info',
    clientId: '***',
    accessToken: '***',
    storeHash: '***',
    responseType: 'json',
    apiVersion: 'v3'
  })
)

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
  }

  if (getByProductIds) {
    productListRepository.getByProductIds(
      input.productIds,
      input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
      input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_OFFSET,
      input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
      input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
    ).then(productResult => {
      cb(null, productResult)
    }).catch(e => {
      cb(e)
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
    }).catch(e => {
      cb(e)
    })
  }
}
