const BigCommerce = require('node-bigcommerce')
const BigcommerceCategory = require('./Repository/BigcommerceCategory.js')
const GetAllVisibleCategoriesByParentId = require('./Repository/Command/GetAllVisibleCategoriesByParentId')
const GetProductCountsByCategoryIds = require('./Repository/Command/GetProductCountsByCategoryIds')

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
    null,
    new GetProductCountsByCategoryIds(
      new BigCommerce({
        logLevel: 'info',
        clientId: '***',
        accessToken: '***',
        storeHash: '***',
        responseType: 'json',
        apiVersion: 'v2'
      })
    )
  )

  bigcommerceCategoryRepository.getRootCategories().then((categories) => {
    context.log.info('Successfully executed @shopgate/bigcommerce-products/getRootCategories_v1')
    context.log.info('Result:')
    context.log.info(categories)

    cb(null, {categories: categories})
  }).catch(function (e) {
    console.log('---------------------------')
    console.log('Error in bigcommerceCategory.getRootCategories:')
    console.log(e)
    console.log('---------------------------')
    cb(null, {categories: []})
  })
}
