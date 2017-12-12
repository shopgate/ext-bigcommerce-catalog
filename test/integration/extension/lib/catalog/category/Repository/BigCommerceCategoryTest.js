const IntegrationCredentials = require('../../../../../../../.integration-credentials')
const BigcommerceCategory = require('../../../../../../../extension/lib/catalog/category/Repository/BigCommerceCategory.js')
const BigCommerceFactory = require('../../../../../../../extension/lib/steps/BigCommerceFactory.js')
const BigcommerceRepositoryCommand = require('../../../../../../../extension/lib/catalog/category/Factory/BigCommerceRepositoryCommand')
const chai = require('chai')
const chaiSubset = require('chai-subset')
const chaiAsPromised = require('chai-as-promised')

chai
  .use(chaiSubset)
  .use(chaiAsPromised)
  .should()

describe('BigcommerceCategoryTest', function () {
  const bigcommerceCategoryRepositoryCommandFactory = new BigcommerceRepositoryCommand(
    new BigCommerceFactory(
      IntegrationCredentials.clientId,
      IntegrationCredentials.accessToken,
      IntegrationCredentials.storeHash
    )
  )

  describe('#getRootCategories', function () {
    it('calls GetAllVisibleCategoriesByParentId#execute', function () {
      const subjectUnderTest = new BigcommerceCategory(bigcommerceCategoryRepositoryCommandFactory)

      return subjectUnderTest.getRootCategories().should.eventually.containSubset([
        {
          id: 19,
          imageUrl: '',
          name: 'Integration test *Do not touch*',
          productCount: 3
        }
      ])
    })
  })
})
