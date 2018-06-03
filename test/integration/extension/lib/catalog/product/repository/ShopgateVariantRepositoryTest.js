const Credentials = require('../../../../../../../.integration-credentials')
const BigCommerceFactory = require('../../../../../../../extension/lib/steps/BigCommerceFactory')
const ShopgateVariantRepository = require('../../../../../../../extension/lib/catalog/product/repository/ShopgateVariantRepository')
const {variantResponse} = require('../data_sets/VariantResponse')

const factory = new BigCommerceFactory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash)

describe('Variants repository', () => {
  it('Retrieve product by ID:113', () => {
    const subjectUnderTest = new ShopgateVariantRepository(factory.createV3())

    return subjectUnderTest.get(113).should.eventually.deep.equal(variantResponse)
  })
})