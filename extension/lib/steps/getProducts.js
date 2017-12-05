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
 * @callback pipelineCallback
 * @param {Error} errorMessage
 * @param {Object} responseObject
 */

/**
 * @typedef {Object} AdditionalPropFilter
 * @property {number} [input.filters.additionalProp1.minimum]
 * @property {number} [input.filters.additionalProp1.maximum]
 * @property {string[]} [input.filters.additionalProp1.values]
 * @property {string} [input.filters.additionalProp1.source]
 */

/**
 * @param {Object} context
 * @param {Object} input - Properties depend on the pipeline this is used for
 * @param {pipelineCallback} cb
 *
 * @param {string} [input.categoryId]
 * @param {string} [input.searchPhrase]
 * @param {number} [input.offset]
 * @param {number} [input.limit]
 * @param {string} [input.sort]
 * @param {boolean} [input.showInactive=false]
 * @param {string[]} [input.productIds]
 * @param {boolean} [input.characteristics]
 * @param {Object} [input.filters]
 *
 * @param {AdditionalPropFilter} [input.filters.additionalProp1]
 * @param {AdditionalPropFilter} [input.filters.additionalProp2]
 * @param {AdditionalPropFilter} [input.filters.additionalProp3]
 */
module.exports = function (context, input, cb) {
  if (input.hasOwnProperty('productIds') && input.productIds) {
    bigCommerceProductApi.getProductsResultForProductIds(
      input.productIds,
      input.hasOwnProperty('offset') ? input.offset : 0,
      input.hasOwnProperty('limit') ? input.limit : 20,
      input.hasOwnProperty('sort') ? input.sort : 'random',
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
      input.hasOwnProperty('sort') ? input.sort : 'random',
      input.hasOwnProperty('showInactive') ? input.showInactive : false
    ).then(productResult => {
      cb(null, productResult)
    }).catch(e => {
      console.log(e)
    })
  }
}
