const ShopgateCategoryRepository = require('../catalog/category/repository/Shopgate')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigCommerceRepositoryCommand = require('../catalog/category/factory/RepositoryCommand')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {string} input.categoryId
 * @param {boolean} input.includeChildren
 * @param {string} input.childrenSort
 * @param {GetCategoryCallback} cb
 */
module.exports = async (context, input, cb) => {
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash
  )
  const bigCommerceClientV3 = bigCommerceFactory.createV3()
  const shopgateCategoryRepository = new ShopgateCategoryRepository(
    new BigCommerceRepositoryCommand(
      bigCommerceClientV3
    )
  )
  const apiTimings = new ApiTimings(context.log, 'getCategory_v1')

  const categoryId = parseInt(input.categoryId)

  try {
    const category = (
      await (
        input.includeChildren
          ? shopgateCategoryRepository.getByIdWithChildren(categoryId)
          : shopgateCategoryRepository.getById(categoryId)
      )
    ).toShopgateCategory()

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getCategory_v1 with categoryId: ' + input.categoryId)
    context.log.debug('Result: ' + JSON.stringify(category))

    cb(null, category)
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getCategory_v1 with categoryId: ' + input.categoryId)
    cb(error)
  } finally {
    apiTimings.report(bigCommerceClientV3.timings)
  }
}
