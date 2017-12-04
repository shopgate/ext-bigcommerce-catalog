const BigCommerce = require('node-bigcommerce')
const BigcommerceCategory = require('./Repository/BigcommerceCategory.js')
const GetCategoryById = require('./Repository/Command/GetCategoryById')

const bigcommerceCategory = new BigcommerceCategory(
  null,
  new GetCategoryById(
    new BigCommerce({
      logLevel: 'info',
      clientId: '***',
      accessToken: '***',
      storeHash: '***',
      responseType: 'json',
      apiVersion: 'v3'
    })
  )
)

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {string} input.categoryId
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  bigcommerceCategory.getCategory(parseInt(input.categoryId)).then((category) => {
    cb(null, category)
  }).catch(function (e) {
    console.log('---------------------------')
    console.log('Error in bigCommerceCategoryApi.getCategory:')
    console.log(e)
    console.log('---------------------------')
    cb(null, {})
  })
}
