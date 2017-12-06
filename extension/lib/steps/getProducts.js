const BigCommerce = require('node-bigcommerce')
const BigCommerceProductApi = require('../../lib/catalog/ProductListRepository.js')

const bigCommerceProductApi = new BigCommerceProductApi(
  new BigCommerce({
    logLevel: 'info',
    clientId: '5qsw38039y6dwq37wp6nzabyq11cpru',
    accessToken: 'evgf1d16l0iu1bpmckjw8an0wkxl9hx',
    storeHash: 'r5s844ad',
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
