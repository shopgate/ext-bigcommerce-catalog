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
  getRootCategories () {
    return this.getAllCategories(0, true, ['id', 'parent_id', 'name', 'image_url']).then((pages) => {
      return this.buildResultCategoriesFromPages(pages)
    })
  }

  /**
   * @param {number} categoryId
   *
   * @return PromiseLike<ResultCategory[]>
   */
  getCategoryChildren (categoryId) {
    return this.getAllCategories(categoryId, true, ['id', 'parent_id', 'name', 'image_url']).then((pages) => {
      return this.buildResultCategoriesFromPages(pages)
    })
  }

  /**
   * @param {number} categoryId
   *
   * @return PromiseLike<ResultCategory>
   */
  getCategory (categoryId) {
    return this.apiVersion3Client.get('/catalog/categories?id=' + categoryId).then((categories) => {
      return this.buildCategory(categories.data[0])
    }).then((resultCategory) => {
      let countPromises = [resultCategory]

      countPromises.push(this.apiVersion2Client.get('/products/count?category=' + encodeURIComponent(resultCategory.name)))
      countPromises.push(this.apiVersion3Client.get('/catalog/categories?parent_id=' + resultCategory.id))

      return Promise.all(countPromises)
    }).then((promises) => {
      let resultCategory = promises[0]
      resultCategory.productCount = promises[1].count
      resultCategory.childrenCount = promises[2].data.length

      return resultCategory
    })
  }

  /**
   * @param {number} parentId
   * @param {boolean} isVisible
   * @param {string[]} includeFields
   *
   * @return PromiseLike<Pages[]>
   */
  getAllCategories (parentId, isVisible, includeFields) {
    return this.getCategoryFirstPage(parentId, isVisible, 250, includeFields).then((firstPage) => {
      return Promise.all(
        [firstPage].concat(
          this.getCategorySubsequentPages(
            firstPage.meta.pagination.total_pages,
            parentId,
            isVisible,
            250,
            includeFields
          )
        )
      )
    })
  }

  /**
   * @param {number} parentId
   * @param {boolean} isVisible
   * @param {number} pageSize
   * @param {string[]} includeFields
   *
   * @return PromiseLike<BigCommerceCategoryPage>
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
   * @return PromiseLike<BigcommerceCategoryPage>[]
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
