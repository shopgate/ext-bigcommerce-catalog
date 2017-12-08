const BigCommerce = require('node-bigcommerce')
const BigcommerceCategory = require('./Repository/BigcommerceCategory.js')
const GetAllVisibleCategoriesByParentId = require('./Repository/Command/GetAllVisibleCategoriesByParentId')

module.exports = function (context, input, cb) {
  /**
   * @param {object} context
   * @param {object} input - Properties depend on the pipeline this is used for
   * @param {string} input.categoryId
   * @param {Function} cb
   */
  const bigcommerceCategory = new BigcommerceCategory(
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
    null,
    null
  )

  bigcommerceCategory.getCategoryChildren(parseInt(input.categoryId)).then((categories) => {
    cb(null, {children: categories})
  }).catch(function (e) {
    console.log('---------------------------')
    console.log('Error in bigcommerceCategory.getCategoryChildren:')
    console.log(e)
    console.log('---------------------------')
    cb(null, {children: []})
  })
}
