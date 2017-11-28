const BigCommerceProduct = require('./BigCommerceProduct.js')

class BigCommerceProductApi {
  constructor (apiVersion2Client, apiVersion3Client) {
    this.apiVersion2Client = apiVersion2Client
    this.apiVersion3Client = apiVersion3Client
  }

  getProductResultForCategoryId (categoryId, offset, limit, sort, showInactive) {
    let parameters = [
      'include=variants,images,bulk_pricing_rules',
      'categories:in=' + categoryId
    ]

    if (!showInactive) {
      parameters.push('is_visible=1')
    }

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

  getProductResultForProductIds (productIds, offset, limit, sort, showInactive) {
    let pagePromises = []
    let parameters = [
      'include=variants,images,bulk_pricing_rules',
    ]

    if (!showInactive) {
      parameters.push('is_visible=1')
    }

    for (let productId of productIds) {
      pagePromises.push(this.apiVersion3Client.get('/catalog/products?' + parameters.join('&') + '&id=' + productId))
    }

    return this.getProducts(pagePromises, productIds.length)
  }

  getProducts (pagePromises, totalProductsCount) {
    const products = []

    return Promise.all(pagePromises).then(bigCommerceProductReponses => {
      let promisesForBrands = []

      for (let bigCommerceProductRequest of bigCommerceProductReponses) {
        for (let bigCommerceProductData of bigCommerceProductRequest.data) {
          /* @type {BigCommerceProduct} */
          const bigCommerceProduct = new BigCommerceProduct(this.apiVersion3Client, bigCommerceProductData)

          promisesForBrands.push(bigCommerceProduct.getBrandAsync())

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
            tags: bigCommerceProduct.getTags(),
            children: []
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
}

module.exports = BigCommerceProductApi
