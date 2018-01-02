const ShopgateProductBuilder = require('../../../../../../../extension/lib/catalog/product/service/ShopgateProductBuilder')
const ShopgateProduct = require('../../../../../../../extension/lib/catalog/product/entity/ShopgateProduct')
const assert = require('assert')

describe('Shopgate product builder ', () => {
  it('buildes ShopgateProduct for provided bigcommerce data', () => {
    const productBuilder = new ShopgateProductBuilder({id: 11, name: 'test', price: 12.00, sku: '21312321', variants: [{purchasing_disabled: 1, purchasing_disabled_message: 'N/A'}]})

    assert.ok(productBuilder.build() instanceof ShopgateProduct)
  })
})
