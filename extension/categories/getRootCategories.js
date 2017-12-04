const BigCommerce = require('node-bigcommerce')
const BigcommerceCategory = require('./Repository/BigcommerceCategory.js')
const GetAllVisibleCategoriesByParentId = require('./Repository/Command/GetAllVisibleCategoriesByParentId')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  const bigcommerceCategoryRepository = new BigcommerceCategory(
    new GetAllVisibleCategoriesByParentId(
      new BigCommerce({
        logLevel: 'info',
        clientId: '***',
        accessToken: '***',
        storeHash: '***',
        responseType: 'json',
        apiVersion: 'v3'
      })
    ),
    null, null // todo remove
  )

  bigcommerceCategoryRepository.getRootCategories().then((categories) => {
    cb(null, {categories: categories})
  }).catch(function (e) {
    console.log('---------------------------')
    console.log('Error in bigcommerceCategory.getRootCategories:')
    console.log(e)
    console.log('---------------------------')
    cb(null, {categories: []})
  })
}
