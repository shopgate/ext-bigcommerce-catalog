const BigCommerce = require('node-bigcommerce')
const BigCommerceCategoryApi = require('./classes/BigCommerceCategoryApi.js')

const bigCommerceCategoryApi = new BigCommerceCategoryApi(
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
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  bigCommerceCategoryApi.getRootCategories().then((categories) => {
    cb(null, {categories: categories})
  }).catch(console.err)
}
