const BigCommerce = require('node-bigcommerce')

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {string} input.categoryId
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
  const categoryId = input.categoryId

  bigCommerce.get(`/catalog/categories?parent_id=${categoryId}&is_visible=1`).then((bigCommerceCategories) => {
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
      return cb(null, {children: resultCategories})
    } else {
      return cb(null, {children: resultCategories})
    }

}).catch(function (error) {
  console.log(error)
  return cb(null, [])
})
}
