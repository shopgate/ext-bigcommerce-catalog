const PATH_VISIBLE_CATEGORIES = '^/catalog/categories\\?'
const PATH_CATEGORY = '^/catalog/categories/\\d+$'
const PATH_CATEGORY_CHILDREN = '^/catalog/categories/\\?parent_id='
const PATH_CATEGORY_PRODUCT_COUNT = '^/catalog/products/\\?categories'
const PATH_PRODUCT_BRAND = '^/catalog/brands/'
const PATH_PRODUCT = '^/catalog/products/\\d+\\?'
const PATH_PRODUCTS = '^/catalog/products\\?'
const PATH_STORE = '^/store$'

const ALL_PATHS = [
  PATH_VISIBLE_CATEGORIES, PATH_CATEGORY, PATH_CATEGORY_CHILDREN, PATH_CATEGORY_PRODUCT_COUNT,
  PATH_PRODUCT, PATH_PRODUCT_BRAND, PATH_PRODUCTS,
  PATH_STORE
]

const PATH_GROUPS = {
  [PATH_VISIBLE_CATEGORIES]: 'categories',
  [PATH_CATEGORY]: 'category',
  [PATH_CATEGORY_CHILDREN]: 'category_children',
  [PATH_CATEGORY_PRODUCT_COUNT]: 'category_product_count',
  [PATH_PRODUCT_BRAND]: 'product_brand',
  [PATH_PRODUCT]: 'product',
  [PATH_PRODUCTS]: 'products',
  [PATH_STORE]: 'store'
}

class BigCommerceTimings {
  /**
   * @param {Object} logger
   */
  constructor (logger) {
    this._logger = logger
  }

 /**
   * @param {BigCommerceWrapperTiming[]} timings
   */
  report (timings) {
    for (let timing of timings) {
      const group = this._resolvePath(timing.path)

      const logEntry = {
        group: group,
        path: timing.path,
        started: timing.startedOn,
        durationMilliseconds: timing.durationMilliseconds,
        apiVersion: timing.apiVersion,
        msg: 'API request measurement'
      }

      this._logger.info(logEntry)
    }
  }

  /**
   * @param {string} path
   * @return {string}
   * @private
   */
  _resolvePath (path) {
    for (const apiResource of ALL_PATHS) {
      if (RegExp(apiResource).test(path)) {
        return PATH_GROUPS[apiResource]
      }
    }

    return 'unresolved'
  }
}

module.exports = BigCommerceTimings
