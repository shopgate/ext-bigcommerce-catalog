const BigcommerceCategory = require('../catalog/category/Repository/BigCommerceCategory.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigcommerceRepositoryCommand = require('../catalog/category/Factory/BigCommerceRepositoryCommand')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {string} input.categoryId
 * @param {string} input.sort
 * @param {Function} cb
 */
module.exports = async function (context, input, cb) {
  const bigCommerceCategoryRepository = new BigcommerceCategory(
    new BigcommerceRepositoryCommand(
      new BigCommerceFactory(
        context.config.clientId,
        context.config.accessToken,
        context.config.storeHash
      )
    )
  )

  try {
    const categories = await bigCommerceCategoryRepository.getCategoryChildren(parseInt(input.categoryId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-products/getCategoryChildren_v1 with categoryId: ' + input.categoryId)
    context.log.debug('Result: ' + JSON.stringify(categories))

    cb(null, {children: categories})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-products/getCategoryChildren_v1 with categoryId: ' + input.categoryId)
    cb(error)
  }
}
