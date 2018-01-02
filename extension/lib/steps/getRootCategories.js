const ShopgateCategoryRepository = require('../catalog/category/repository/Shopgate')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigcommerceRepositoryCommand = require('../catalog/category/factory/RepositoryCommand')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {GetRootCategoriesCallback} cb
 */
module.exports = async (context, input, cb) => {
  const shopgateCategoryRepository = new ShopgateCategoryRepository(
    new BigcommerceRepositoryCommand(
      new BigCommerceFactory(
        context.config.clientId,
        context.config.accessToken,
        context.config.storeHash
      )
    )
  )

  try {
    const categories = (await shopgateCategoryRepository.getRootCategories()).map(category => category.toShopgateRootCategory())

    context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getRootCategories_v1.')
    context.log.debug('Result: ' + JSON.stringify(categories))

    cb(null, {categories: categories})
  } catch (error) {
    context.log.error('Failed executing @shopgate/bigcommerce-catalog/getRootCategories_v1.')
    cb(error)
  }
}
