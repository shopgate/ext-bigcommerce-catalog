/**
 * @typedef {Object} BigcommerceCategory
 * @property {number} id
 * @property {string} name
 * @property {string} image_url
 * @property {number} parent_id
 */

/**
 * @typedef {Object} BigcommercePagination
 * @property {number} total_pages
 */

/**
 * @typedef {Object} BigcommerceCategoryMeta
 * @property {BigcommercePagination} pagination
 */

/**
 * @typedef {Object} BigcommerceCategoryPage
 * @property {BigcommerceCategory[]} data
 * @property {BigcommerceCategoryMeta} meta
 */

/**
 * @typedef {Object} ResultCategory
 * @property {number} id
 * @property {string} name
 * @property {string} imageUrl
 * @property {{id: number}, {name: string}} parent
 */

class BigCommerceCategoryApi {
  /**
   * @param {BigCommerce} apiVersion2Client
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion2Client, apiVersion3Client) {
    this.apiVersion2Client = apiVersion2Client
    this.apiVersion3Client = apiVersion3Client
  }

  /**
   * @return PromiseLike<ResultCategory[]>
   */
  async getRootCategories () {
    const pages = await this.getAllCategories(0, true, ['id', 'parent_id', 'name', 'image_url'])

    return this.buildResultCategoriesFromPages(pages)
  }

  /**
   * @param {number} categoryId
   *
   * @return PromiseLike<ResultCategory[]>
   */
  async getCategoryChildren (categoryId) {
    const pages = await this.getAllCategories(categoryId, true, ['id', 'parent_id', 'name', 'image_url'])

    return this.buildResultCategoriesFromPages(pages)
  }

  /**
   * @param {number} categoryId
   *
   * @return ResultCategory
   */
  async getCategory (categoryId) {
    const categories = await this.apiVersion3Client.get('/catalog/categories?id=' + categoryId)
    const resultCategory = await this.buildCategory(categories.data[0])

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
   * @return ResultCategory[]
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
   * @return ResultCategory[]
   */
  buildResultCategories (page) {
    let resultCategories = []

    for (let bigcommerceCategory of page.data) {
      resultCategories.push(this.buildCategory(bigcommerceCategory))
    }

    return resultCategories
  }

  /**
   * @param {BigcommerceCategory} bigcommerceCategory
   *
   * @return ResultCategory
   */
  buildCategory (bigcommerceCategory) {
    return {
      id: bigcommerceCategory.id,
      name: bigcommerceCategory.name,
      imageUrl: bigcommerceCategory.image_url,
      parent: {id: bigcommerceCategory.parent_id, name: ''}
    }
  }
}

module.exports = BigCommerceCategoryApi
