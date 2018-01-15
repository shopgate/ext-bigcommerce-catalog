const IntegrationCredentials = require('../../../../../../../.integration-credentials')
const ShopgateRepository = require('../../../../../../../extension/lib/catalog/category/repository/Shopgate')
const BigCommerceFactory = require('../../../../../../../extension/lib/steps/BigCommerceFactory.js')
const RepositoryCommand = require('../../../../../../../extension/lib/catalog/category/factory/RepositoryCommand')
const chai = require('chai')
const chaiSubset = require('chai-subset')
const chaiAsPromised = require('chai-as-promised')
const StoreLogger = require('../../../../../../../extension/lib/store/logger/StoreLogger')

chai
  .use(chaiSubset)
  .use(chaiAsPromised)
  .should()

describe('BigcommerceCategoryTest', function () {
  const context = {
    log: {
      info: function (message) {
        console.log(message)
      }
    },
  }
  const repositoryCommandFactory = new RepositoryCommand(
    new BigCommerceFactory(
      IntegrationCredentials.clientId,
      IntegrationCredentials.accessToken,
      IntegrationCredentials.storeHash
    )
  )

  describe('#getRootCategories', function () {
    it('calls GetAllVisibleCategoriesByParentId#execute', function () {
      const subjectUnderTest = new ShopgateRepository(repositoryCommandFactory, new StoreLogger(context))

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
