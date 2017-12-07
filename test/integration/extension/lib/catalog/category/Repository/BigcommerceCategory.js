const BigCommerce = require('node-bigcommerce')
const BigcommerceCategory = require('../../../../../../../extension/lib/catalog/category/Repository/BigcommerceCategory.js')
const GetAllVisibleCategoriesByParentId = require('../../../../../../../extension/lib/catalog/category/Repository/Command/GetAllVisibleCategoriesByParentId.js')
// const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
// const chaiThings = require('chai-things')
const chaiSubset = require('chai-subset')

chai
  .use(chaiSubset)
  .use(chaiAsPromised)
  .should()

describe('BigcommerceCategoryTest', function () {
  const bigCommerceApi = new BigCommerce({
    logLevel: 'info',
    clientId: '***',
    accessToken: '***',
    storeHash: '***',
    responseType: 'json',
    apiVersion: 'v3'
  })
  const getAllVisibleCategoriesByParentIdCommand = new GetAllVisibleCategoriesByParentId(bigCommerceApi)

  describe('#getRootCategories', function () {
    it('calls GetAllVisibleCategoriesByParentId#execute', function () {
      let subjectUnderTest = new BigcommerceCategory(getAllVisibleCategoriesByParentIdCommand, null)

      return subjectUnderTest.getRootCategories().should.eventually.containSubset([
        {
          id: 19,
          imageUrl: '',
          name: 'Integration test *Do not touch*',
          parent: {
            id: 0,
            name: ''
          }
        }
      ])
    })
  })
})
