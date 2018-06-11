const ProductListRepository = require('../catalog/product/repository/ShopgateProductListRepository.js')
const BigCommerceBrandRepository = require('../catalog/product/repository/BigCommerceBrandRepository')
const ShopgateGetProducts = require('./configuration/GetProductsDefaultArguments')
const BigCommerceFactory = require('./BigCommerceFactory.js')
const BigCommerceConfigurationRepository = require('../store/configuration/BigCommerceRepository')
const ApiTimings = require('./BigCommerceTimings')

/**
 * @param {Object} context
 * @param {GetProductsInput} input - Properties depend on the pipeline this is used for
 * @returns {Promise<ShopgateProductsResponse>}
 */
module.exports = async (context, input) => {
  const getByCategoryId = input.hasOwnProperty('categoryId') && input.categoryId
  const getByProductIds = input.hasOwnProperty('productIds') && input.productIds
  const isHighlightPipeline = input.hasOwnProperty('skipHighlightLoading')
  const loadHighlights = isHighlightPipeline && !input.skipHighlightLoading
  const emptyResponse = {totalProductCount: 0, products: []}

  if (!getByCategoryId && !getByProductIds) {
    return emptyResponse
  }

  let cacheConfig = {}
  if (context.config.cache) {
    cacheConfig = {
      cacheLifetime: context.config.cache.lifetime_sec,
      extensionStorage: context.storage.extension
    }
  }
  const bigCommerceFactory = new BigCommerceFactory(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash,
    cacheConfig
  )

  const bigCommerceApiVersion3 = bigCommerceFactory.createV3()
  const bigCommerceApiVersion2 = bigCommerceFactory.createV2()

  const apiTimings = new ApiTimings(context.log)

  const productListRepository = new ProductListRepository(
    bigCommerceApiVersion3,
    new BigCommerceConfigurationRepository(bigCommerceApiVersion2),
    new BigCommerceBrandRepository(bigCommerceApiVersion3)
  )

  if (getByProductIds) {
    try {
      const products = await productListRepository.getByProductIds(
        input.productIds,
        input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
        input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
      )

      context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProducts_v1.')
      context.log.debug('Result: ' + JSON.stringify(products))

      if (isHighlightPipeline) {
        return loadHighlights ? filterHighlights(products) : emptyResponse
      }

      return products
    } catch (error) {
      context.log.error(
        'Failed executing @shopgate/bigcommerce-catalog/getProducts_v1 with parameters: ' + JSON.stringify(input),
        error
      )
      throw error
    } finally {
      apiTimings.report(bigCommerceApiVersion2.timings)
      apiTimings.report(bigCommerceApiVersion3.timings)
    }
  }

  if (getByCategoryId) {
    try {
      const products = await productListRepository.getByCategoryId(
        input.categoryId,
        input.hasOwnProperty('offset') ? input.offset : ShopgateGetProducts.DEFAULT_OFFSET,
        input.hasOwnProperty('limit') ? input.limit : ShopgateGetProducts.DEFAULT_LIMIT,
        input.hasOwnProperty('sort') ? input.sort : ShopgateGetProducts.DEFAULT_SORT,
        input.hasOwnProperty('showInactive') ? input.showInactive : ShopgateGetProducts.DEFAULT_SHOW_INACTIVE
      )

      context.log.debug('Successfully executed @shopgate/bigcommerce-catalog/getProducts_v1.')
      context.log.debug('Result: ' + JSON.stringify(products))

      return products
    } catch (error) {
      context.log.error('Unable to get products for categoryId: ' + input.categoryId, error)
      throw error
    } finally {
      apiTimings.report(bigCommerceApiVersion2.timings)
      apiTimings.report(bigCommerceApiVersion3.timings)
    }
  }
}

/**
 * Loads only the products that are featured
 */
function filterHighlights (data) {
  const list = data.products.filter(product => product.highlight === true)

  return {
    products: list,
    totalProductCount: list.length
  }
}
