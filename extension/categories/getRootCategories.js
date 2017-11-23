const BigCommerce = require('node-bigcommerce')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  const bigCommerce = new BigCommerce({
    logLevel: 'info',
    clientId: '***',
    accessToken: '***',
    storeHash: '***',
    responseType: 'json',
    apiVersion: 'v3'
  })

  bigCommerce.get('/catalog/categories?parent_id=0&is_visible=1&include_fields=id,name,image_url').then((bigCommerceCategories) => {
    console.log(bigCommerceCategories)
    const resultCategories = []

    bigCommerceCategories.data.forEach((bigCommerceCategory) => {
      resultCategories.push({
        id: bigCommerceCategory.id,
        name: bigCommerceCategory.name,
        productCount: 0,
        imageUrl: bigCommerceCategory.image_url
      })
    })

    const totalPages = bigCommerceCategories.meta.pagination.total_pages
    if (totalPages === 1) {
      return cb(null, {categories: resultCategories})
    } else {
      return cb(null, {categories: resultCategories})
    }
  }, console.error)
}
