const ProductWeight = require('../value_objects/ShopgateWeight')
const PropertyMapper = require('../service/ShopgatePropertyMapper')

class ShopgatePropertiesRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {StoreLogger} storeLogger
   */
  constructor (apiVersion3Client, storeLogger) {
    this._client = apiVersion3Client
    this._storeLogger = storeLogger
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProperty[]>}
   */
  async get (id) {
    this._storeLogger.startTimmer()
    const response = await this._client.get('/catalog/products/' + id + '?include_fields=weight')
    this._storeLogger.logTime('get product properties')
    const shopgateProperties = []
    Array.prototype.push.apply(
      shopgateProperties,
      PropertyMapper.mapWeight(new ProductWeight(response.data.weight, 'g'))
    )

    return shopgateProperties
  }
}

module.exports = ShopgatePropertiesRepository
