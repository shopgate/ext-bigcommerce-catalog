const BigCommerceProduct = require('./BigCommerceProduct.js')

const SORT_PRICE_ASC = 'priceAsc'
const SORT_PRICE_DESC = 'priceDesc'
const SORT_RELEVANCE = 'relevance'
const SORT_RANDOM = 'random'

class BigCommerceProductApi {
  constructor (apiVersion2Client, apiVersion3Client) {
    this.apiVersion2Client = apiVersion2Client
    this.apiVersion3Client = apiVersion3Client
  }

  /**
   * @param {int} categoryId
   * @param {int} offset
   * @param {int} limit
   * @param {string} sort
   * @param showInactive
   * @returns {{totalProductCount: {int}, products: {Array}}}
   */
  getProductResultForCategoryId (categoryId, offset, limit, sort, showInactive) {
    let parameters = [
      'include=variants,images,bulk_pricing_rules',
      'categories:in=' + categoryId
    ]

    if (!showInactive) {
      parameters.push('is_visible=1')
    }

    parameters = this.addSorting(parameters, sort)

    const apiUrl = '/catalog/products?' + parameters.join('&')
    let totalProductsCount = 0

    return this.apiVersion3Client.get(apiUrl).then((firstPage) => {
      let pagePromises = [firstPage]
      totalProductsCount = firstPage.meta.pagination.total

      if (firstPage.meta.pagination.total_pages > 1) {
        for (let i = 2; i <= firstPage.meta.pagination.total_pages; i++) {
          pagePromises.push(this.apiVersion3Client.get(apiUrl + '&page=' + i))
        }
      }

      return this.getProducts(pagePromises, totalProductsCount)
    })
  }

  /**
   * @param {int[]} productIds
   * @param {int} offset
   * @param {int} limit
   * @param {string} sort
   * @param showInactive
   * @returns {{totalProductCount: {int}, products: {Array}}}
   */
  getProductResultForProductIds (productIds, offset, limit, sort, showInactive) {
    let pagePromises = []
    let parameters = [
      'include=variants,images,bulk_pricing_rules'
    ]

    if (!showInactive) {
      parameters.push('is_visible=1')
    }

    parameters = this.addSorting(parameters, sort)

    for (let productId of productIds) {
      pagePromises.push(this.apiVersion3Client.get('/catalog/products?' + parameters.join('&') + '&id=' + productId))
    }

    return this.getProducts(pagePromises, productIds.length)
  }

  /**
   * @param {Promise[]} pagePromises
   * @param {int} totalProductsCount
   * @returns {{totalProductCount: {int}, products: {Array}}}
   */
  getProducts (pagePromises, totalProductsCount) {
    const products = []

    return Promise.all(pagePromises).then(bigCommerceProductReponses => {
      let promisesForBrands = []

      bigCommerceProductReponses.forEach(bigCommerceProductRequest => {
        bigCommerceProductRequest.data.forEach(bigCommerceProductData => {
          /* @type {BigCommerceProduct} */
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
        })
      })

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
   * @param {array} parameters
   * @param {string} sort
   * @returns {array}
   */
  addSorting (parameters, sort) {
    switch (sort) {
      case SORT_PRICE_ASC:
        parameters.push('sort=price')
        parameters.push('direction=asc')
        break
      case SORT_PRICE_DESC:
        parameters.push('sort=price')
        parameters.push('direction=desc')
        break
      case SORT_RELEVANCE:
        parameters.push('sort=total_sold')
        parameters.push('direction=desc')
        break
      case SORT_RANDOM:
      default:
        break
    }

    return parameters
  }

  /**
   * @returns {Promise.<string>}
   */
  async getBrandAsync (brandId) {
    if (brandId) {
      const data = await this.apiVersion3Client.get('/catalog/brands/' + brandId)

      if (data.data.hasOwnProperty('name')) {
        return data.data.name
      }

      return ''
    }
  }
}

module.exports = BigCommerceProductApi
