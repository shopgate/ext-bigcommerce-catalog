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

  bigCommerce.get(`/catalog/categories?id=${categoryId}`).then((bigCommerceCategories) => {
    console.log(bigCommerceCategories)
  const category = bigCommerceCategories.data[0]

  const result = {
    id: category.id,
    name: category.name,
    productCount: 0,
    imageUrl: category.image_url,
    childrenCount: 0,
    parent: {id: category.parent_id, name: ''}
  }

    return cb(null, result)

}).catch(function (error) {
    console.log(error)
    return cb(null, {})
  })
}
