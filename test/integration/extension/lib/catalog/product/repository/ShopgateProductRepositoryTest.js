const Credentials = require('../../../../../../../.integration-credentials.js')
const ShopgateProductRepository = require('../../../../../../../extension/lib/catalog/product/repository/ShopgateProductRepository')
const ShopgateProduct = require('../../../../../../../extension/lib/catalog/product/entity/ShopgateProduct')
const BigCommerceBrandRepository = require('../../../../../../../extension/lib/catalog/product/repository/BigCommerceBrandRepository')
const BigCommerceConfigRepository = require('../../../../../../../extension/lib/store/configuration/BigCommerceRepository')
const BigCommerceFactory = require('../../../../../../../extension/lib/steps/BigCommerceFactory')
const StoreLogger = require('../../../../../../../extension/lib/store/logger/StoreLogger')

describe('Product get by id', () => {
  it('will return a Product object with name, price and currency', () => {
    const factory = new BigCommerceFactory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash)
    const configRepository = new BigCommerceConfigRepository(factory.createV2())
    const context = {
      log: {
        info: function (message) {}
      },
    }
    const subjectUnderTest = new ShopgateProductRepository(
      factory.createV3(),
      configRepository,
      new BigCommerceBrandRepository(
        factory.createV3()
      ),
      new StoreLogger(context)
    )

    const expectedProduct = {
      id: 114,
      name: 'SG IT Simple product',
      manufacturer: 'Chanel',
      price: {
        currency: 'USD',
        unitPrice: 69.99
      },
      identifiers: {
        sku: 'SG-IT-01'
      },
      active: true,
      type: 'simple'
    }

    return Promise.all([
      subjectUnderTest.get(114).should.eventually.be.fulfilled.and.be.instanceOf(ShopgateProduct).and.containSubset(expectedProduct)
    ])
  })
})
