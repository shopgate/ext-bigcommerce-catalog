const Credentials = require('../../../../../../.integration-credentials')
const BigCommerceFactory = require('../../../../../../extension/lib/steps/BigCommerceFactory')
const ShopgatePropertiesRepository = require('../../../../../../extension/lib/catalog/product/ShopgatePropertiesRepository')

const factory = new BigCommerceFactory(Credentials.clientId, Credentials.accessToken, Credentials.storeHash)

describe('Product properties by product id', () => {
  it('will return weight', () => {
    const subjectUnderTest = new ShopgatePropertiesRepository(factory.createV3())

    const expectedProperties = [
      {
        label: 'Weight',
        value: '230'
      },
      {
        label: 'Weight unit',
        value: 'g'
      }
    ]

    return subjectUnderTest.get(114).should.eventually.deep.equal(expectedProperties)
  })
})
