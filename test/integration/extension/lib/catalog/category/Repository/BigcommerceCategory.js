const IntegrationCredentials = require('../../../../../../../.integration-credentials')
const BigcommerceCategory = require('../../../../../../../extension/lib/catalog/category/Repository/BigcommerceCategory.js')
const BigCommerceFactory = require('../../../../../../../extension/lib/steps/BigCommerceFactory.js')
const BigcommerceRepositoryCommand = require('../../../../../../../extension/lib/catalog/category/Factory/BigcommerceRepositoryCommand')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')

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
      let subjectUnderTest = new BigcommerceCategory(bigcommerceCategoryRepositoryCommandFactory)

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
