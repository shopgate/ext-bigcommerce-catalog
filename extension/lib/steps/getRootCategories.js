const BigcommerceCategory = require('../catalog/category/Repository/BigCommerceCategory.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigcommerceRepositoryCommand = require('../catalog/category/Factory/BigCommerceRepositoryCommand')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
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

  const categories = await bigCommerceCategoryRepository.getRootCategories()

  try {
    context.log.info('Successfully executed @shopgate/bigcommerce-products/getRootCategories_v1.')
    context.log.info('Result: ' + JSON.stringify(categories))

    cb(null, {categories: categories})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-products/getRootCategories_v1.')
    cb(error)
  }
}
