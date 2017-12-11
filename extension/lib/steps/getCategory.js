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
    context.log.debug('Successfully executed @shopgate/bigcommerce-products/getCategory_v1 with categoryId: ' + input.categoryId)
    context.log.debug('Result: ' + JSON.stringify(category))

    cb(null, category)
  }).catch(function (e) {
    context.log.error('Failed executing @shopgate/bigcommerce-products/getCategory_v1 with categoryId: ' + input.categoryId)
    cb(e)
  })
}
