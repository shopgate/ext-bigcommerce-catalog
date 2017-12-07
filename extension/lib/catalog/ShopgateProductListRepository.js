const ShopgateProductBuilder = require('./product/ShopgateBuilder')
const Sort = require('./product/ShopgateSort.js')

class ShopgateProductListRepository {
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
   * @returns {Promise<GetProductsResponse>}
   */
  async getByCategoryId (categoryId, offset, limit, sort, showInactive) {
    const bigCommerceGetParameters = this.prepareParametersForGetProducts(offset, limit, sort, showInactive)

    bigCommerceGetParameters.push('categories:in=' + categoryId)

    /**
     * @type BigCommercePage
     */
    const firstPage = await this.apiVersion3Client.get('/catalog/products?' + bigCommerceGetParameters.join('&'))

    return this.getProducts([firstPage], firstPage.meta.pagination.total)
  }

  /**
   * @param {number} offset
   * @param {number} limit
   * @returns {number}
   */
  _calculateCurrentBigCommercePage (offset, limit) {
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
    const parameters = []

    if (!showInactive) {
      parameters.push('is_visible=1')
    }

    parameters.push('include=variants,images,bulk_pricing_rules')
    parameters.push('type=physical')
    parameters.push('availability=available')
    parameters.push('page=' + this._calculateCurrentBigCommercePage(offset, limit))
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
   * @returns {Promise<GetProductsResponse>}
   */
  async getByProductIds (productIds, offset, limit, sort, showInactive) {
    const pagePromises = []
    const bigCommerceGetParameters = this.prepareParametersForGetProducts(offset, limit, sort, showInactive)

    for (const productId of productIds) {
      pagePromises.push(this.apiVersion3Client.get('/catalog/products?' + bigCommerceGetParameters.join('&') + '&id=' + productId))
    }

    return this.getProducts(pagePromises, productIds.length)
  }

  /**
   * @param {Promise[]} pagePromises
   * @param {number} totalProductsCount
   * @returns {Promise<GetProductsResponse>}
   */
  async getProducts (pagePromises, totalProductsCount) {
    /**
     * @type {ShopgateProduct[]}
     */
    const products = []

    const bigCommerceProductReponses = await Promise.all(pagePromises)

    let promisesForBrands = []
    for (const bigCommerceProductRequest of bigCommerceProductReponses) {
      for (const bigCommerceProductData of bigCommerceProductRequest.data) {
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
   * @param {ShopgateProduct[]} products
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
    const sortingParameters = []

    switch (sort) {
      case Sort.PRICE_ASC:
        sortingParameters.push('sort=price')
        sortingParameters.push('direction=asc')
        break
      case Sort.PRICE_DESC:
        sortingParameters.push('sort=price')
        sortingParameters.push('direction=desc')
        break
      case Sort.RELEVANCE:
        sortingParameters.push('sort=total_sold')
        sortingParameters.push('direction=desc')
        break
      case Sort.RANDOM:
      default:
        break
    }

    return sortingParameters
  }

  /**
   * @returns {Promise<string>}
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

module.exports = ShopgateProductListRepository
