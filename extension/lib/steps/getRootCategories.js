const BigcommerceCategory = require('../catalog/category/Repository/BigcommerceCategory.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigcommerceRepositoryCommand = require('../catalog/category/Factory/BigcommerceRepositoryCommand')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
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

  bigcommerceCategoryRepository.getRootCategories().then((categories) => {
    context.log.info('Successfully executed @shopgate/bigcommerce-products/getRootCategories_v1.')
    context.log.info('Result: ' + JSON.stringify(categories))

    cb(null, {categories: categories})
  }).catch(function (e) {
    context.log.error('Failed executing @shopgate/bigcommerce-products/getRootCategories_v1.')
    cb(e)
  })
}
