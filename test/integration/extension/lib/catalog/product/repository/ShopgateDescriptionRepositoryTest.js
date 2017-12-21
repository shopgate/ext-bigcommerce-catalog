const Credentials = require('../../../../../../../.integration-credentials')
const BigCommerceFactory = require('../../../../../../../extension/lib/steps/BigCommerceFactory')
const ShopgateDescriptionRepository = require('../../../../../../../extension/lib/catalog/product/repository/ShopgateDescriptionRepository.js')

const factory = new BigCommerceFactory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash)

describe('Product description by product id', () => {
  it('will return description', () => {
    const subjectUnderTest = new ShopgateDescriptionRepository(factory.createV3())

    const expectedDescription = '<p>This is a very short description.</p>'
    return subjectUnderTest.get(114).should.eventually.deep.equal(expectedDescription)
  })
})
