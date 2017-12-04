const BigCommerceProduct = require('./BigCommerceProduct.js')

const SORT_PRICE_ASC = 'priceAsc'
const SORT_PRICE_DESC = 'priceDesc'
const SORT_RELEVANCE = 'relevance'
const SORT_RANDOM = 'random'

class BigCommerceProductApi {
  constructor (apiVersion3Client) {
    this.apiVersion3Client = apiVersion3Client
  }

  /**
   * @param {number} categoryId
   * @param {number} offset
   * @param {number} limit
   * @param {string} sort
   * @param {boolean} showInactive
   * @returns {{totalProductCount: number, products: Array}}
   */
  getProductResultForCategoryId (categoryId, offset, limit, sort, showInactive) {
    let bigCommerceGetParameters = this.prepareParametersForGetProducts(offset, limit, sort, showInactive)

    bigCommerceGetParameters.push('categories:in=' + categoryId)

    return this.apiVersion3Client.get(
      '/catalog/products?' + bigCommerceGetParameters.join('&')
    ).then((firstPage) => {
      return this.getProducts([firstPage], firstPage.meta.pagination.total)
    })
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
   * @param {boolean} showInactive
   * @param {number} offset
   * @param {number} limit
   * @param {string} sort
   * @returns {Array}
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
  getProducts (pagePromises, totalProductsCount) {
    const products = []

    return Promise.all(pagePromises).then(bigCommerceProductReponses => {
      let promisesForBrands = []

      for (let bigCommerceProductRequest of bigCommerceProductReponses) {
        for (let bigCommerceProductData of bigCommerceProductRequest.data) {
          const bigCommerceProduct = new BigCommerceProduct(bigCommerceProductData)

          promisesForBrands.push(this.getBrandAsync(bigCommerceProduct.getBrandId()))

          products.push({
            id: bigCommerceProduct.getId(),
            active: bigCommerceProduct.isActive(),
            availability: bigCommerceProduct.getAvailablity(),
            identifiers: bigCommerceProduct.getIdentifiers(),
            name: bigCommerceProduct.getName(),
            stock: bigCommerceProduct.getStock(),
            rating: bigCommerceProduct.getRating(),
            featuredImageUrl: bigCommerceProduct.getFeaturedImageUrl(),
            price: bigCommerceProduct.getPrice(),
            flags: bigCommerceProduct.getTags(),
            liveshoppings: [],
            highlight: bigCommerceProduct.getHighlight(),
            parent: bigCommerceProduct.getParent(),
            type: bigCommerceProduct.getType(),
            tags: bigCommerceProduct.getTags()
          })
        }
      }
      return Promise.all(promisesForBrands)
    }).then(brands => {
      for (let i = 0; i < brands.length; ++i) {
        if (typeof brands[i] === 'undefined') {
          continue
        }

        products[i].manufacturer = brands[i]
      }

      return {
        totalProductCount: totalProductsCount,
        products: products
      }
    })
  }

  /**
   * @param {string} sort
   * @returns {Array}
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
    if (brandId) {
      const data = await
        this.apiVersion3Client.get('/catalog/brands/' + brandId)

      if (data.data.hasOwnProperty('name')) {
        return data.data.name
      }

      return ''
    }
  }
}

module.exports = BigCommerceProductApi
