const BigCommerce = require('node-bigcommerce')
const ShopgateProductListRepository = require('../../../../../extension/lib/catalog/ShopgateProductListRepository.js')
const ShopgateProduct = require('../../../../../extension/lib/catalog/product/entity/ShopgateProduct.js')
const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised).should()

describe('ShopgateProductListRepository', function () {
  const BigCommerceApi = new BigCommerce({})
  let subjectUnderTest

  beforeEach(function () {
    subjectUnderTest = new ShopgateProductListRepository(BigCommerceApi)
  })

  describe('Calculation of the current BigCommerce page', function () {
    it('should return current page for a given valid limit/offset', function () {
      assert.equal(subjectUnderTest._calculateCurrentBigCommercePage(0, 5), 1)
    })

    it('should return the next lower page in case offset is not a multiple of limit', function () {
      assert.equal(subjectUnderTest._calculateCurrentBigCommercePage(8, 5), 2)
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

  describe('updating manufacturer', function () {
    it('should apply all the brands to the manufacturer field:', function () {
      const brands = ['first Manufacturer', 'second Manufacturer']
      /**
       * @type {ShopgateProduct[]}
       */
      const products = [new ShopgateProduct({}), new ShopgateProduct({})]

      subjectUnderTest.updateProductManufacturer(brands, products)

      assert.equal(products[0].manufacturer, 'first Manufacturer')
      assert.equal(products[1].manufacturer, 'second Manufacturer')
    })

    it('shouldn\'t return is_visible=1 when inactive products shouldn\'t be returned', function () {
      assert.equal(subjectUnderTest.prepareParametersForGetProducts(0, 20, 'random', true).indexOf('is_visible=1') === -1, true)
    })
  })
})
