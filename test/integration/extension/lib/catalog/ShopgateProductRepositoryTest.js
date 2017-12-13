const Credentials = require('../../../../../.integration-credentials.js')
const ShopgateProductRepository = require('../../../../../extension/lib/catalog/ShopgateProductRepository')
const ShopgateProduct = require('../../../../../extension/lib/catalog/product/entity/ShopgateProduct')
const BigCommerceConfigRepository = require('../../../../../extension/lib/store/configuration/BigCommerceRepository')
const BigCommerceFactory = require('../../../../../extension/lib/steps/BigCommerceFactory')

describe('Product get by id', () => {
  it('will return a Product object with name, price and currency', () => {
    const factory = new BigCommerceFactory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash)
    const configRepository = new BigCommerceConfigRepository(factory.createV2())
    const subjectUnderTest = new ShopgateProductRepository(
      factory.createV3(),
      configRepository
    )

    const expectedProduct = {
      id: 114,
      name: 'SG IT Simple product',
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
