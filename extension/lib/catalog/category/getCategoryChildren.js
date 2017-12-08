const BigCommerce = require('node-bigcommerce')
const BigcommerceCategory = require('./Repository/BigcommerceCategory.js')
const GetAllVisibleCategoriesByParentId = require('./Repository/Command/GetAllVisibleCategoriesByParentId')
const GetProductCountsByCategoryIds = require('./Repository/Command/GetProductCountsByCategoryIds')

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
    new GetProductCountsByCategoryIds(
      new BigCommerce({
        logLevel: 'info',
        clientId: '5qsw38039y6dwq37wp6nzabyq11cpru',
        accessToken: 'evgf1d16l0iu1bpmckjw8an0wkxl9hx',
        storeHash: 'r5s844ad',
        responseType: 'json',
        apiVersion: 'v2'
      })
    )
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
