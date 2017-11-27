class BigCommerceCategoryApi {
  constructor (apiVersion2Client, apiVersion3Client) {
    this.apiVersion2Client = apiVersion2Client
    this.apiVersion3Client = apiVersion3Client
  }

  getRootCategories () {
    let resultCategories = []

    return this.apiVersion3Client.get('/catalog/categories?parent_id=0&is_visible=1&include_fields=id,name,image_url').then((firstPage) => {
      let pagePromises = [firstPage]

      if (firstPage.meta.pagination.total_pages > 1) {
        for (let i = 2; i <= firstPage.meta.pagination.total_pages; i++) {
          pagePromises.push(this.apiVersion3Client.get('/catalog/categories?parent_id=0&is_visible=1&include_fields=id,name,image_url&page=' + i))
        }
      }

      return Promise.all(pagePromises)
    }).then((allPages) => {
      let productCountPerCategoryPromises = []

      allPages.forEach((page) => {
        page.data.forEach((bigCommerceCategory) => {
          resultCategories.push({
            id: bigCommerceCategory.id,
            name: bigCommerceCategory.name,
            productCount: 0,
            imageUrl: bigCommerceCategory.image_url
          })

          productCountPerCategoryPromises.push(this.apiVersion2Client.get('/products/count?category=' + encodeURIComponent(bigCommerceCategory.name)))
        })
      })

      return Promise.all(productCountPerCategoryPromises)
    }).then((productCounts) => {
      productCounts.forEach((productCount, resultCategoryIndex) => {
        resultCategories[resultCategoryIndex].productCount = productCount.count
      })

      return resultCategories
    })
  }
}

module.exports = BigCommerceCategoryApi
