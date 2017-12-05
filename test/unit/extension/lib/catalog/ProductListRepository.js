const BigCommerceProductApi = require('../../../../../extension/lib/catalog/ProductListRepository.js')
const BigCommerce = require('node-bigcommerce')
const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised).should()

describe('ProductListRepository', function () {
  const BigCommerceApi = new BigCommerce({
    logLevel: 'info',
    clientId: '***',
    accessToken: '***',
    storeHash: '***',
    responseType: 'json',
    apiVersion: 'v3'
  })
  const subjectUnderTest = new BigCommerceProductApi(BigCommerceApi)

  describe('Calculation of the current BigCommerce page', function () {
    it('should return current page for a given valid limit/offset', function () {
      assert.equal(subjectUnderTest.calculateCurrentBigCommercePage(0, 5), 1)
    })

    it('should return the next lower page in case offset is not a multiple of limit', function () {
      assert.equal(subjectUnderTest.calculateCurrentBigCommercePage(8, 5), 2)
    })
  })

  describe('Sorting of products', function () {
    it('sorting "random" should return an empty array', function () {
      assert.deepEqual(subjectUnderTest.getSortingParameters('random'), [])
    })

    it('sorting "priceAsc" should return sort parameter for price and asc', function () {
      assert.deepEqual(subjectUnderTest.getSortingParameters('priceAsc'), [
        'sort=price',
        'direction=asc'
      ])
    })

    it('sorting "priceDesc" should return sort parameter for price and desc"', function () {
      assert.deepEqual(subjectUnderTest.getSortingParameters('priceDesc'), [
        'sort=price',
        'direction=desc'
      ])
    })

    it('sorting "relevance" should return sort parameter for total_sold and desc', function () {
      assert.deepEqual(subjectUnderTest.getSortingParameters('relevance'), [
        'sort=total_sold',
        'direction=desc'
      ])
    })
  })

  describe('Parameters for get products call', function () {
    it('should return for default - these parameters:', function () {
      assert.deepEqual(
        subjectUnderTest.prepareParametersForGetProducts(0, 20, 'random', false),
        [
          'is_visible=1',
          'include=variants,images,bulk_pricing_rules',
          'type=physical',
          'availability=available',
          'page=1',
          'limit=20'
        ]
      )
    })

    it('shouldn\'t return is_visible=1 when inactive products shouldn\'t be returned', function () {
      assert.equal(subjectUnderTest.prepareParametersForGetProducts(0, 20, 'random', true).indexOf('is_visible=1') === -1, true)
    })
  })
})
