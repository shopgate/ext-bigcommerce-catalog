const Credentials = require('../../../../../../../.integration-credentials')
const BigCommerceFactory = require('../../../../../../../extension/lib/steps/BigCommerceFactory')
const ShopgateProductShippingRepository = require('../../../../../../../extension/lib/catalog/product/repository/ShopgateShippingRepository')
const ShopgateProductShipping = require('../../../../../../../extension/lib/catalog/product/entity/ShopgateShipping')
const BigCommerceProductEntityFactory = require('../../../../../../../extension/lib/catalog/product/factory/BigCommerceEntityFactory')
const BigCommerceConfigRepository = require('../../../../../../../extension/lib/store/configuration/BigCommerceRepository')

const factory = new BigCommerceFactory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash)
const configRepository = new BigCommerceConfigRepository(factory.createV2())

describe('Shopgate shipping repository', function () {
  it('should return valid shipping information when requested', function () {
    const subjectUnderTest = new ShopgateProductShippingRepository(factory.createV3(), new BigCommerceProductEntityFactory(configRepository))
    const expectedShipping = new ShopgateProductShipping(5.59, 'USD')
    return subjectUnderTest.get(114).should.eventually.deep.equal(expectedShipping)
  })
})
