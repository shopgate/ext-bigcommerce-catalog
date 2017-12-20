const BigCommerceCategory = require('../catalog/category/Repository/BigCommerceCategory.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigCommerceRepositoryCommand = require('../catalog/category/Factory/BigCommerceRepositoryCommand')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {string} input.categoryId
 * @param {string} input.sort
 * @param {GetCategoryChildrenCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceCategoryRepository = new BigCommerceCategory(
    new BigCommerceRepositoryCommand(
      new BigCommerceFactory(
        context.config.clientId,
        context.config.accessToken,
        context.config.storeHash
      )
    )
  )

  try {
    const categories = await bigCommerceCategoryRepository.getCategoryChildren(parseInt(input.categoryId))

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getCategoryChildren_v1 with categoryId: ' + input.categoryId)
    context.log.debug('Result: ' + JSON.stringify(categories))

    cb(null, {children: categories})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getCategoryChildren_v1 with categoryId: ' + input.categoryId)
    cb(error)
  }
}
