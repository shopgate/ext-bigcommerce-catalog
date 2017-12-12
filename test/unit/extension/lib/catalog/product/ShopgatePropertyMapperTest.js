'use strict'

const ShopgateProductWeight = require('../../../../../../extension/lib/catalog/product/property/ShopgateWeight')
const ShopgateProductPropertyMapper = require('../../../../../../extension/lib/catalog/product/ShopgatePropertyMapper')
const ShopgateProductProperty = require('../../../../../../extension/lib/catalog/product/ShopgateProperty')
const assert = require('assert')

describe('ShopgatePropertyMapper', () => {
  it('maps shopgate product weight to the shopgate property', function () {
    ShopgateProductPropertyMapper.mapWeight(new ShopgateProductWeight(10, 'kg')).forEach(entry => {
      assert.ok(entry instanceof ShopgateProductProperty)
    })
  })
})
