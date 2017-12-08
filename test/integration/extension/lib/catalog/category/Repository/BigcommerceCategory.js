const IntegrationCredentials = require('../../../../../../../.integration-credentials')
const BigCommerce = require('node-bigcommerce')
const BigcommerceCategory = require('../../../../../../../extension/lib/catalog/category/Repository/BigcommerceCategory.js')
const GetAllVisibleCategoriesByParentId = require('../../../../../../../extension/lib/catalog/category/Repository/Command/GetAllVisibleCategoriesByParentId.js')
const GetProductCountsByCategoryIds = require('../../../../../../../extension/lib/catalog/category/Repository/Command/GetProductCountsByCategoryIds.js')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')

chai
  .use(chaiSubset)
  .use(chaiAsPromised)
  .should()

describe('BigcommerceCategoryTest', function () {
  const bigCommerceApiVersion3 = new BigCommerce({
    logLevel: 'info',
    clientId: IntegrationCredentials.clientId,
    accessToken: IntegrationCredentials.accessToken,
    storeHash: IntegrationCredentials.storeHash,
    responseType: 'json',
    apiVersion: 'v3'
  })

  const bigCommerceApiVersion2 = new BigCommerce({
    logLevel: 'info',
    clientId: IntegrationCredentials.clientId,
    accessToken: IntegrationCredentials.accessToken,
    storeHash: IntegrationCredentials.storeHash,
    responseType: 'json',
    apiVersion: 'v2'
  })
  const getAllVisibleCategoriesByParentIdCommand = new GetAllVisibleCategoriesByParentId(bigCommerceApiVersion3)
  const getProductCountsByCategoryIds = new GetProductCountsByCategoryIds(bigCommerceApiVersion2)

  describe('#getRootCategories', function () {
    it('calls GetAllVisibleCategoriesByParentId#execute', function () {
      let subjectUnderTest = new BigcommerceCategory(getAllVisibleCategoriesByParentIdCommand, null, getProductCountsByCategoryIds)

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
