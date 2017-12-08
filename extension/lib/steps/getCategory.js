const BigcommerceCategory = require('../catalog/category/Repository/BigcommerceCategory.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigcommerceRepositoryCommand = require('../catalog/category/Factory/BigcommerceRepositoryCommand')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {string} input.categoryId
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  const bigcommerceCategoryRepository = new BigcommerceCategory(
    new BigcommerceRepositoryCommand(
      new BigCommerceFactory(
        context.config.clientId,
        context.config.accessToken,
        context.config.storeHash
      )
    )
  )

  bigcommerceCategoryRepository.getCategory(parseInt(input.categoryId)).then((category) => {
    context.log.info('Successfully executed @shopgate/bigcommerce-products/getCategory_v1')
    context.log.info('Requested category ID: ' + input.categoryId)
    context.log.info('Result:')
    context.log.info(category)

    cb(null, {category: category})
  }).catch(function (e) {
    console.log('---------------------------')
    console.log('Error in bigCommerceCategoryApi.getCategory:')
    console.log(e)
    console.log('---------------------------')
    cb(null, {})
  })
}
