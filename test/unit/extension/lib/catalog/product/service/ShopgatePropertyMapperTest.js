const ShopgateProductWeight = require('../../../../../../../extension/lib/catalog/product/value_objects/ShopgateWeight')
const ShopgateProductPropertyMapper = require('../../../../../../../extension/lib/catalog/product/service/ShopgatePropertyMapper')
const ShopgateProductProperty = require('../../../../../../../extension/lib/catalog/product/entity/ShopgateProperty')
const assert = require('assert')

describe('ShopgatePropertyMapper', () => {
  it('maps shopgate product weight to shopgate properties', function () {
    const expectedShopgateProperties = [
      new ShopgateProductProperty('Weight', '10'),
      new ShopgateProductProperty('Weight unit', 'kg')
    ]
    const actualShopgateProperties = ShopgateProductPropertyMapper.mapWeight(new ShopgateProductWeight(10, 'kg'))

    assert.deepEqual(actualShopgateProperties, expectedShopgateProperties)
  })
})
