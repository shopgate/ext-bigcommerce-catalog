const IntegrationCredentials = require('../../../../../../../.integration-credentials')
const ShopgateRepository = require('../../../../../../../extension/lib/catalog/category/repository/Shopgate')
const BigCommerceFactory = require('../../../../../../../extension/lib/steps/BigCommerceFactory.js')
const RepositoryCommand = require('../../../../../../../extension/lib/catalog/category/factory/RepositoryCommand')
const chai = require('chai')
const chaiSubset = require('chai-subset')
const chaiAsPromised = require('chai-as-promised')

chai
  .use(chaiSubset)
  .use(chaiAsPromised)
  .should()

describe('BigcommerceCategoryTest', function () {
  const repositoryCommandFactory = new RepositoryCommand(
    new BigCommerceFactory(
      IntegrationCredentials.clientId,
      IntegrationCredentials.accessToken,
      IntegrationCredentials.storeHash
    ).createV3()
  )

  describe('#getRootCategories', function () {
    it('calls GetAllVisibleCategoriesByParentId#execute', function () {
      const subjectUnderTest = new ShopgateRepository(repositoryCommandFactory)

      return subjectUnderTest.getRootCategories().should.eventually.containSubset([
        {
          "_id": 19,
          "_imageUrl": "",
          "_name": "Integration test *Do not touch*"
        }
      ])
    })
  })
})
