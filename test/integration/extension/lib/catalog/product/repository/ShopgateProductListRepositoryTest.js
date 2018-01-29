const IntegrationCredentials = require('../../../../../../../.integration-credentials')
const BigCommerce = require('node-bigcommerce')
const ShopgateProductListRepository = require('../../../../../../../extension/lib/catalog/product/repository/ShopgateProductListRepository.js')
const ShopgateSort = require('../../../../../../../extension/lib/catalog/product/value_objects/ShopgateSort.js')
const BigCommerceConfigRepository = require('../../../../../../../extension/lib/store/configuration/BigCommerceRepository.js')
const BigCommerceBrandRepository = require('../../../../../../../extension/lib/catalog/product/repository/BigCommerceBrandRepository.js')

describe('ShopgateProductListRepository', function () {
  const BigCommerceApi = new BigCommerce({
    logLevel: 'info',
    clientId: IntegrationCredentials.clientId,
    accessToken: IntegrationCredentials.accessToken,
    storeHash: IntegrationCredentials.storeHash,
    responseType: 'json',
    apiVersion: 'v3'
  })

  const BigCommerceApiV2 = new BigCommerce({
    logLevel: 'info',
    clientId: IntegrationCredentials.clientId,
    accessToken: IntegrationCredentials.accessToken,
    storeHash: IntegrationCredentials.storeHash,
    responseType: 'json',
    apiVersion: 'v2'
  })

  let subjectUnderTest
  beforeEach(function () {
    subjectUnderTest = new ShopgateProductListRepository(BigCommerceApi, new BigCommerceConfigRepository(BigCommerceApiV2), new BigCommerceBrandRepository(BigCommerceApi))
  })

  describe('getByCategoryId', function () {
    it('should responed with two products', function () {
      const response = subjectUnderTest.getByCategoryId('19', 0, 2, ShopgateSort.RANDOM, false)

      return Promise.all([
        response.should.be.fulfilled.and.eventually.have.property('totalProductCount'),
        response.should.be.fulfilled.and.eventually.have.property('products').an('array').with.length(2)
      ])
    })
  })

  describe('getByProductIds', function () {
    it('should responed with two products', function () {
      const response = subjectUnderTest.getByProductIds(['112', '113'], 0, 10, ShopgateSort.RANDOM, true)

      const integrationTestProducts = [
        {
          'id': 112,
          'active': true,
          'manufacturer': 'Anna',
          'name': '[Integration Test] Nutellabrot *Do not touch* ',
          'price': {
            'unitPrice': 30,
            'unitPriceNet': 30,
            'unitPriceWithTax': 30,
            'taxAmount': 0,
            'taxPercent': 19,
            'currency': 'USD'
          }
        },
        {
          'id': 113,
          'active': true,
          'manufacturer': 'Collette',
          'name': '[Integration Test][Sample] Collette, alligator clutch *Do not touch*',
          'price': {
            'unitPrice': 280,
            'unitPriceNet': 280,
            'unitPriceWithTax': 280,
            'taxAmount': 0,
            'taxPercent': 19,
            'currency': 'USD'
          }
        }
      ]

      return Promise.all([
        response.should.be.fulfilled
          .and.eventually.have.property('products').containSubset(integrationTestProducts)
          .and.then((products) => {
            products.forEach((product) => {
              product.featuredImageUrl.should.match(/^https:\/\/\w+.bigcommerce.com\/s-r5s844ad\/products\/.+$/)
            })
          })
      ])
    })
  })
})
