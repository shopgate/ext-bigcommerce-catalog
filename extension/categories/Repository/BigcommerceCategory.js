const ShopgateCategory = require('../Entity/ShopgateCategory')

class BigcommerceCategory {
  /**
   * @param {BigCommerce} apiVersion2Client
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion2Client, apiVersion3Client) {
    this.apiVersion2Client = apiVersion2Client
    this.apiVersion3Client = apiVersion3Client
  }

  /**
   * @return PromiseLike<ShopgateCategory[]>
   */
  async getRootCategories () {
    const pages = await this.getAllCategories(0, true, ['id', 'parent_id', 'name', 'image_url'])

    return this.buildResultCategoriesFromPages(pages)
  }

  /**
   * @param {number} categoryId
   *
   * @return PromiseLike<ShopgateCategory[]>
   */
  async getCategoryChildren (categoryId) {
    const pages = await this.getAllCategories(categoryId, true, ['id', 'parent_id', 'name', 'image_url'])

    return this.buildResultCategoriesFromPages(pages)
  }

  /**
   * @param {number} categoryId
   *
   * @return ShopgateCategory
   */
  async getCategory (categoryId) {
    const categories = await this.apiVersion3Client.get('/catalog/categories?id=' + categoryId)
    const resultCategory = ShopgateCategory.fromBigcommerceCategory(categories.data[0])

    let countPromises = [resultCategory]
    countPromises.push(this.apiVersion2Client.get('/products/count?category=' + encodeURIComponent(resultCategory.name)))
    countPromises.push(this.apiVersion3Client.get('/catalog/categories?parent_id=' + resultCategory.id))

    const fulfilledCountPromises = await Promise.all(countPromises)
    resultCategory.productCount = fulfilledCountPromises[1].count
    resultCategory.childrenCount = fulfilledCountPromises[2].data.length

    return resultCategory
  }

  /**
   * @param {number} parentId
   * @param {boolean} isVisible
   * @param {string[]} includeFields
   *
   * @return Promise<BigcommerceCategoryPage[]>
   */
  async getAllCategories (parentId, isVisible, includeFields) {
    const firstPage = await this.getCategoryFirstPage(parentId, isVisible, 250, includeFields)
    const subsequentPages = await this.getCategorySubsequentPages(
      firstPage.meta.pagination.total_pages,
      parentId,
      isVisible,
      250,
      includeFields
    )

    return Promise.all([firstPage].concat(subsequentPages))
  }

  /**
   * @param {number} parentId
   * @param {boolean} isVisible
   * @param {number} pageSize
   * @param {string[]} includeFields
   *
   * @return Promise<BigCommerceCategoryPage>
   */
  getCategoryFirstPage (parentId, isVisible, pageSize, includeFields) {
    return this.apiVersion3Client.get(
      '/catalog/categories?parent_id=' + parentId +
      '&limit=' + pageSize +
      '&is_visible=' + (isVisible ? 1 : 0) +
      '&include_fields=' + includeFields.join(',')
    )
  }

  /**
   * @param {number} totalPages
   * @param {number} parentId
   * @param {boolean} isVisible
   * @param {number} pageSize
   * @param {string[]} includeFields
   *
   * @return Promise<BigcommerceCategoryPage>[]
   */
  getCategorySubsequentPages (totalPages, parentId, isVisible, pageSize, includeFields) {
    let pagePromises = []

    for (let page = 2; page < totalPages; page++) {
      pagePromises.push(
        this.apiVersion3Client.get(
          '/catalog/categories?parent_id=' + parentId +
          '&limit=' + pageSize +
          '&is_visible=' + (isVisible ? 1 : 0) +
          '&include_fields=' + includeFields.join(',')
        )
      )
    }

    return pagePromises
  }

  /**
   * @param {BigcommerceCategoryPage[]} pages
   *
   * @return ShopgateCategory[]
   */
  buildResultCategoriesFromPages (pages) {
    let resultCategories = []

    for (let page of pages) {
      Array.prototype.push.apply(resultCategories, this.buildResultCategories(page))
    }

    return resultCategories
  }

  /**
   * @param {BigcommerceCategoryPage} page
   * @return ShopgateCategory[]
   */
  buildResultCategories (page) {
    let resultCategories = []

    for (let bigcommerceCategory of page.data) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigcommerceCategory))
    }

    return resultCategories
  }
}

module.exports = BigcommerceCategory
