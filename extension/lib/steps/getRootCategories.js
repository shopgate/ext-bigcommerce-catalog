const BigCommerceCategory = require('../catalog/category/Repository/BigCommerceCategory.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigcommerceRepositoryCommand = require('../catalog/category/Factory/BigCommerceRepositoryCommand')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {GetRootCategoriesCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceCategoryRepository = new BigCommerceCategory(
    new BigcommerceRepositoryCommand(
      new BigCommerceFactory(
        context.config.clientId,
        context.config.accessToken,
        context.config.storeHash
      )
    )
  )

  try {
    const categories = await bigCommerceCategoryRepository.getRootCategories()

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getRootCategories_v1.')
    context.log.debug('Result: ' + JSON.stringify(categories))

    cb(null, {categories: categories})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getRootCategories_v1.')
    cb(error)
  }
}
