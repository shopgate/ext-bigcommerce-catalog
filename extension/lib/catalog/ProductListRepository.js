const ShopgateProductBuilder = require('./product/ShopgateProductBuilder.js')

const SORT_PRICE_ASC = 'priceAsc'
const SORT_PRICE_DESC = 'priceDesc'
const SORT_RELEVANCE = 'relevance'
const SORT_RANDOM = 'random'

class ProductListRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this.apiVersion3Client = apiVersion3Client
  }

  /**
   * @param {string} categoryId
   * @param {number} offset
   * @param {number} limit
   * @param {string} sort
   * @param {boolean} showInactive
   * @returns {{totalProductCount: number, products: Array}}
   */
  async getProductResultForCategoryId (categoryId, offset, limit, sort, showInactive) {
    let bigCommerceGetParameters = this.prepareParametersForGetProducts(offset, limit, sort, showInactive)

    bigCommerceGetParameters.push('categories:in=' + categoryId)

    /**
     * @type BigCommerceApiPage
     */
    const firstPage = await this.apiVersion3Client.get('/catalog/products?' + bigCommerceGetParameters.join('&'))

    return this.getProducts([firstPage], firstPage.meta.pagination.total)
  }

  /**
   * @param {number} offset
   * @param {number} limit
   * @returns {number}
   */
  calculateCurrentBigCommercePage (offset, limit) {
    return Math.floor(offset / limit) + 1
  }

  /**
   * @param {number} offset
   * @param {number} limit
   * @param {string} sort
   * @param {boolean} showInactive
   * @returns {string[]}
   */
  prepareParametersForGetProducts (offset, limit, sort, showInactive) {
    let parameters = []

    if (!showInactive) {
      parameters.push('is_visible=1')
    }

    parameters.push('include=variants,images,bulk_pricing_rules')
    parameters.push('type=physical')
    parameters.push('availability=available')
    parameters.push('page=' + this.calculateCurrentBigCommercePage(offset, limit))
    parameters.push('limit=' + limit)

    Array.prototype.push.apply(parameters, this.getSortingParameters(sort))

    return parameters
  }

  /**
   * @param {string[]} productIds
   * @param {number} offset
   * @param {number} limit
   * @param {string} sort
   * @param {boolean} showInactive
   * @returns {{totalProductCount: number, products: Array}}
   */
  getProductsResultForProductIds (productIds, offset, limit, sort, showInactive) {
    let pagePromises = []
    let bigCommerceGetParameters = this.prepareParametersForGetProducts(offset, limit, sort, showInactive)

    for (let productId of productIds) {
      pagePromises.push(this.apiVersion3Client.get('/catalog/products?' + bigCommerceGetParameters.join('&') + '&id=' + productId))
    }

    return this.getProducts(pagePromises, productIds.length)
  }

  /**
   * @param {Promise[]} pagePromises
   * @param {number} totalProductsCount
   * @returns {{totalProductCount: number, products: Array}}
   */
  async getProducts (pagePromises, totalProductsCount) {
    /**
     * @type {ShopgateProduct[]}
     */
    const products = []

    const bigCommerceProductReponses = await Promise.all(pagePromises)

    let promisesForBrands = []
    for (let bigCommerceProductRequest of bigCommerceProductReponses) {
      for (let bigCommerceProductData of bigCommerceProductRequest.data) {
        const shopgateProductBuilder = new ShopgateProductBuilder(bigCommerceProductData)

        products.push(shopgateProductBuilder.build())

        promisesForBrands.push(this.getBrandAsync(shopgateProductBuilder.getBrandId()))
      }
    }

    const brands = await Promise.all(promisesForBrands)
    this.updateProductManufacturer(brands, products)

    return {
      totalProductCount: totalProductsCount,
      products: products
    }
  }

  /**
   * @param {string[]} brands
   * @param {Array} products
   */
  updateProductManufacturer (brands, products) {
    for (let i = 0; i < brands.length; ++i) {
      if (typeof brands[i] === 'undefined') {
        continue
      }

      products[i].manufacturer = brands[i]
    }

    return products
  }

  /**
   * @param {string} sort
   * @returns {string[]}
   */
  getSortingParameters (sort) {
    let sortingParameters = []

    switch (sort) {
      case SORT_PRICE_ASC:
        sortingParameters.push('sort=price')
        sortingParameters.push('direction=asc')
        break
      case SORT_PRICE_DESC:
        sortingParameters.push('sort=price')
        sortingParameters.push('direction=desc')
        break
      case SORT_RELEVANCE:
        sortingParameters.push('sort=total_sold')
        sortingParameters.push('direction=desc')
        break
      case SORT_RANDOM:
      default:
        break
    }

    return sortingParameters
  }

  /**
   * @returns {Promise.<string>}
   */
  async getBrandAsync (brandId) {
    if (!brandId) {
      return ''
    }

    const data = await this.apiVersion3Client.get('/catalog/brands/' + brandId)

    if (data.data.hasOwnProperty('name')) {
      return data.data.name
    }

    return ''
  }
}

module.exports = ProductListRepository
