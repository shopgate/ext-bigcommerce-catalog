const BigCommerce = require('node-bigcommerce')

class BigCommerceCategoryApi {
  constructor (apiVersion2Client, apiVersion3Client) {
    this.apiVersion2Client = apiVersion2Client
    this.apiVersion3Client = apiVersion3Client
  }

  getRootCategories () {
    let resultCategories = []

    return this.apiVersion3Client.get('/catalog/categories?parent_id=0&is_visible=1&include_fields=id,name,image_url').then((firstPage) => {
      let promises = [firstPage]

      if (firstPage.meta.pagination.total_pages > 1) {
        for (let i = 2; i <= firstPage.meta.pagination.total_pages; i++) {
          promises.push(this.apiVersion3Client.get('/catalog/categories?parent_id=0&is_visible=1&include_fields=id,name,image_url&limit=1&page=' + i))
        }
      }

      return Promise.all(promises)
    }).then((allPages) => {
      allPages.forEach((page) => {
        page.data.forEach((bigCommerceCategory) => {
          resultCategories.push({
            id: bigCommerceCategory.id,
            name: bigCommerceCategory.name,
            productCount: 0,
            imageUrl: bigCommerceCategory.image_url
          })
        })
      })

      console.log(resultCategories)
      return resultCategories
    })
  }
}

/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
  let resultCategories = []

  let apiWrapper = new BigCommerceCategoryApi(
    new BigCommerce({
      logLevel: 'info',
      clientId: '***',
      accessToken: '***',
      storeHash: '***',
      responseType: 'json',
      apiVersion: 'v2'
    }),
    new BigCommerce({
      logLevel: 'info',
      clientId: '***',
      accessToken: '***',
      storeHash: '***',
      responseType: 'json',
      apiVersion: 'v3'
    })
  )

  apiWrapper.getRootCategories().then((categories) => {
    cb(null, {categories: categories})
  }).catch(console.err)
  return

  const bigCommerceV3 = new BigCommerce({
    logLevel: 'info',
    clientId: '5qsw38039y6dwq37wp6nzabyq11cpru',
    accessToken: 'evgf1d16l0iu1bpmckjw8an0wkxl9hx',
    storeHash: 'r5s844ad',
    responseType: 'json',
    apiVersion: 'v3'
  })

  bigCommerceV3.get('/catalog/categories?parent_id=0&is_visible=1&include_fields=id,name,image_url')
    .then((bigCommerceCategories) => {
      let productCountPromises = []

      bigCommerceCategories.data.forEach((bigCommerceCategory) => {
        resultCategories.push({
          id: bigCommerceCategory.id,
          name: bigCommerceCategory.name,
          productCount: 0,
          imageUrl: bigCommerceCategory.image_url
        })

        productCountPromises.push(bigCommerceV2.get('/products/count?category=' + encodeURIComponent(bigCommerceCategory.name)))
      })

      return Promise.all(new Map([
        ['categories', bigCommerceCategories],
        ['productCounts', Promise.all(productCountPromises)]
      ]))
    })
    .then(async (promises) => {
      await new Map(promises).get('productCounts').then((productCounts) => {
        productCounts.forEach((promise, index) => {
          resultCategories[index].productCount = promise.count
        })
      })
    })
    .then(() => {
      cb(null, {categories: resultCategories})
    })
    .catch(console.err)
}
