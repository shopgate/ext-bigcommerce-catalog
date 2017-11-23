const BigCommerce = require('node-bigcommerce')
const BigCommerceProduct = require('./BigCommerceProduct.js')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 *
 * @param {string} [input.categoryId]
 * @param {string} [input.searchPhrase]
 * @param {Object} [input.filters]
 * @param {int} [input.offset]
 * @param {int} [input.limit]
 * @param {string} [input.sort]
 * @param {boolean} [input.showInactive=false]
 * @param {string[]} [input.productIds]
 * @param {boolean} [input.characteristics]
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  const bigCommerceApi = new BigCommerce({
    logLevel: 'info',
    clientId: '5qsw38039y6dwq37wp6nzabyq11cpru',
    accessToken: 'evgf1d16l0iu1bpmckjw8an0wkxl9hx',
    responseType: 'json',
    storeHash: 'r5s844ad',
    apiVersion: 'v3' // Default is v2
  })

  let products = []

  bigCommerceApi.get('/catalog/products?limit=1').then(async data => {
    console.log(data)

    for (let bigCommerceProductData of data['data']) {
      /* @type {BigCommerceProduct} */
      const bigCommerceProduct = new BigCommerceProduct(bigCommerceApi, bigCommerceProductData)

      await bigCommerceProduct.getBrand().then((brand) => {
        products.push({
          id: bigCommerceProduct.getId(),
          active: bigCommerceProduct.isActive(),
          availability: bigCommerceProduct.getAvailablity(),
          identifiers: bigCommerceProduct.getIdentifiers(),
          manufacturer: brand,
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
      )
    }

    console.log(products)

    cb(null, {
      totalProductCount: 0,
      products: products
    })
  })
}
