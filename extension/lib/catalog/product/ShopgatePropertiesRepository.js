const ProductWeight = require('./property/ShopgateWeight')
const PropertyMapper = require('./ShopgatePropertyMapper')
const ShopgateProperty = require('./ShopgateProperty')

class ShopgatePropertiesRepository {
  /**
   * @param {BigCommerce} apiVersion3Client
   * @param {ShopgateBrandRepository} shopgateBrandRepository
   */
  constructor (apiVersion3Client, shopgateBrandRepository) {
    this._client = apiVersion3Client
    this._shopgateBrandRepository = shopgateBrandRepository
  }

  /**
   * @param {number} id
   * @returns {Promise<ShopgateProperty[]>}
   */
  async get (id) {
    const response = await this._client.get('/catalog/products/' + id + '?include_fields=weight,upc,mpn,gtin,brand_id')
    const brand = await this._shopgateBrandRepository.get(response.data.brand_id)
    const shopgateProperties = []
    const allowedIdentifiers = ['upc', 'mpn', 'gtin']
    Array.prototype.push.apply(
      shopgateProperties,
      PropertyMapper.mapWeight(new ProductWeight(response.data.weight, 'g'))
    )

    allowedIdentifiers.forEach(function (identifier) {
      if (response.data[identifier]) {
        shopgateProperties.push(
          new ShopgateProperty(identifier.toUpperCase(),
            response.data[identifier]),
        )
      }
    })
    if (brand) {
      shopgateProperties.push(new ShopgateProperty('Brand', brand))
    }
    return shopgateProperties
  }
}

module.exports = ShopgatePropertiesRepository
