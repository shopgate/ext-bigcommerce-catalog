const ShopgateProductBuilder = require('./product/ShopgateBuilder')

class ShopgateProductDescriptionRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   */
  constructor (apiVersion3Client) {
    this.apiVersion3Client = apiVersion3Client
  }

  async getProductDescriptionById (productId) {
    const bcProduct = await this.apiVersion3Client.get('/catalog/products/' + productId);
    return this.getDescriptionObject(bcProduct);
  }
  getDescriptionObject (bcProduct) {
    var descriptionObject = {};
    descriptionObject.description = bcProduct.data.description;
    return descriptionObject;
  }
}
module.exports = ShopgateProductDescriptionRepository
