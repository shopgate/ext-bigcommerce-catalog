const ShopgateCategory = require('../Entity/ShopgateCategory')

class BigcommerceCategory {
  /**
   * @param {GetAllVisibleCategoriesByParentId} getAllCategories
   * @param {BigCommerce} apiVersion2Client
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (getAllCategories, apiVersion2Client, apiVersion3Client) {
    this.getAllCategories = getAllCategories
    this.apiVersion2Client = apiVersion2Client
    this.apiVersion3Client = apiVersion3Client
  }

  /**
   * @return PromiseLike<ShopgateCategory[]>
   */
  async getRootCategories () {
    this.getAllCategories.parentId = 0
    this.getAllCategories.includeFields = ['id', 'parent_id', 'name', 'image_url']

    return this.buildShopgateCategories(await this.getAllCategories.execute())
  }

  /**
   * @param {number} categoryId
   *
   * @return ShopgateCategory[]
   */
  async getCategoryChildren (categoryId) {
    this.getAllCategories.parentId = categoryId
    this.getAllCategories.includeFields = ['id', 'parent_id', 'name', 'image_url']

    return this.buildShopgateCategories(await this.getAllCategories.execute())
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
   * @param {BigcommerceCategory[]} bigcommerceCategories
   * @return ShopgateCategory[]
   */
  buildShopgateCategories (bigcommerceCategories) {
    let resultCategories = []

    for (let bigcommerceCategory of bigcommerceCategories) {
      resultCategories.push(ShopgateCategory.fromBigcommerceCategory(bigcommerceCategory))
    }

    return resultCategories
  }
}

module.exports = BigcommerceCategory
