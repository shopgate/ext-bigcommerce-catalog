const BigCommerceCategory = require('../catalog/category/repository/BigCommerceCategory.js')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigCommerceRepositoryCommand = require('../catalog/category/factory/BigCommerceRepositoryCommand')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {string} input.categoryId
 * @param {boolean} input.includeChildren
 * @param {string} input.childrenSort
 * @param {GetCategoryCallback} cb
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

  const categoryId = parseInt(input.categoryId)

  try {
    const category = await (
      input.includeChildren
        ? bigCommerceCategoryRepository.getCategoryWithChildren(categoryId)
        : bigCommerceCategoryRepository.getCategory(categoryId)
    )

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getCategory_v1 with categoryId: ' + input.categoryId)
    context.log.debug('Result: ' + JSON.stringify(category))

    cb(null, category)
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getCategory_v1 with categoryId: ' + input.categoryId)
    cb(error)
  }
}
