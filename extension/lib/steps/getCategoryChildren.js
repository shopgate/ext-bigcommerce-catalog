const ShopgateCategoryRepository = require('../catalog/category/repository/Shopgate')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigCommerceRepositoryCommand = require('../catalog/category/factory/RepositoryCommand')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {string} input.categoryId
 * @param {string} input.sort
 * @param {GetCategoryChildrenCallback} cb
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

  const apiTimings = new ApiTimings(context.log, 'getCategoryChildren_v1')

  try {
    const categories = (await shopgateCategoryRepository.getChildrenByParentId(parseInt(input.categoryId))).map(
      category => category.toShopgateChildCategory()
    )

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getCategoryChildren_v1 with categoryId: ' + input.categoryId)
    context.log.debug('Result: ' + JSON.stringify(categories))

    cb(null, {children: categories})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getCategoryChildren_v1 with categoryId: ' + input.categoryId)
    cb(error)
  } finally {
    apiTimings.report(bigCommerceClientV3.timings)
  }
}
