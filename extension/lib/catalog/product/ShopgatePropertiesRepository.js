const ProductWeight = require('./property/ShopgateWeight')
const PropertyMapper = require('./ShopgatePropertyMapper')

class ShopgatePropertiesRepository {
  /**
   * @param {BigCommerce} client
   */
  constructor (client) {
    this.client = client
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProperty[]>}
   */
  async get (id) {
    const response = await this.client.get('/catalog/products/' + id + '?include_fields=weight')
    const shopgateProperties = []
    Array.prototype.push.apply(
      shopgateProperties,
      PropertyMapper.mapWeight(new ProductWeight(response.data.weight, 'g'))
    )

    return shopgateProperties
  }
}

module.exports = ShopgatePropertiesRepository
