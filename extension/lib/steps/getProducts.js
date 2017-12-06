const BigCommerce = require('node-bigcommerce')
const BigCommerceProductApi = require('../../lib/catalog/ProductListRepository.js')

const bigCommerceProductApi = new BigCommerceProductApi(
  new BigCommerce({
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
  if (input.hasOwnProperty('productIds') && input.productIds) {
    bigCommerceProductApi.getProductsResultForProductIds(
      input.productIds,
      input.hasOwnProperty('offset') ? input.offset : 0,
      input.hasOwnProperty('limit') ? input.limit : 20,
      input.hasOwnProperty('sort') ? input.sort : BigCommerceProductApi.SORT_RANDOM,
      input.hasOwnProperty('showInactive') ? input.showInactive : false
    ).then(productResult => {
      cb(null, productResult)
    }).catch(e => {
      console.log(e)
    })
  }

  if (input.hasOwnProperty('categoryId') && input.categoryId) {
    bigCommerceProductApi.getProductResultForCategoryId(
      input.categoryId,
      input.hasOwnProperty('offset') ? input.offset : 0,
      input.hasOwnProperty('limit') ? input.limit : 20,
      input.hasOwnProperty('sort') ? input.sort : BigCommerceProductApi.SORT_RANDOM,
      input.hasOwnProperty('showInactive') ? input.showInactive : false
    ).then(productResult => {
      cb(null, productResult)
    }).catch(e => {
      console.log(e)
    })
  }
}
