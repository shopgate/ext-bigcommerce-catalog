const BigCommerce = require('node-bigcommerce')
const BigCommerceProduct = require('./BigCommerceProduct.js')

const BigCommerceProductApi = require('./BigCommerceProductApi.js')

const bigCommerceProductApi = new BigCommerceProductApi(
  new BigCommerce({
    logLevel: 'info',
    clientId: '***',
    accessToken: '***',
    storeHash: '***',
    responseType: 'json',
    apiVersion: 'v2'
  }),
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
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 *
 * @param {string} [input.categoryId]
 * @param {string} [input.searchPhrase]
 * @param {Object} [input.filters]
 * @param {int} [input.offset]
 * @param {int} [input.limit]
 * @param {string} [input.sort]
 * @param {boolean} [input.showInactive=false]
 * @param {string[]} [input.productIds]
 * @param {boolean} [input.characteristics]
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  if (input.hasOwnProperty('productIds') && input.productIds) {
    bigCommerceProductApi.getProductResultForProductIds(
      input.productIds,
      input.hasOwnProperty('offset') ? input.offset : 0,
      input.hasOwnProperty('limit') ? input.limit : 20,
      input.hasOwnProperty('sort') ? input.sort : 'random',
      input.hasOwnProperty('showInactive') ? input.showInactive : false
    ).then(productResult => {
      cb(null, productResult)
    })
  }

  if (input.hasOwnProperty('categoryId') && input.categoryId) {
    bigCommerceProductApi.getProductResultForCategoryId(
      input.categoryId,
      input.hasOwnProperty('offset') ? input.offset : 0,
      input.hasOwnProperty('limit') ? input.limit : 20,
      input.hasOwnProperty('sort') ? input.sort : 'random',
      input.hasOwnProperty('showInactive') ? input.showInactive : false
    ).then(productResult => {
      cb(null, productResult)
    })
  }
}
