const ShopgateProductShippingRepository = require('../../../../../../extension/lib/catalog/product/ShopgateShippingRepository')
const sinon = require('sinon')
const BigCommerceClient = require('node-bigcommerce')
const BigCommerceProductEntityFactory = require('../../../../../../extension/lib/catalog/product/BigCommerceEntityFactory')
const ShopgateProductShipping = require('./../../../../../../extension/lib/catalog/product/ShopgateShipping')
const BigCommerceProductEntity = require('./../../../../../../extension/lib/catalog/product/entity/BigCommerceProduct')
const BigCommerceConfiguration = require('./../../../../../../extension/lib/store/configuration/BigCommerceRepository')

describe('ShopgateProductShippingRepositoryTest', () => {
  let clientStub
  let bigCommerceProductEntityFactoryStub, bigCommerceConfigurationStub

  beforeEach(() => {
    clientStub = sinon.createStubInstance(BigCommerceClient)
    clientStub.get.returns({ data: {} })
    bigCommerceProductEntityFactoryStub = sinon.createStubInstance(BigCommerceProductEntityFactory)
    bigCommerceConfigurationStub = sinon.createStubInstance(BigCommerceConfiguration)
    bigCommerceConfigurationStub.getCurrency.returns('USD')
  })

  it('should provide free shipping when big commerce product has is_free_shipping set', () => {
    bigCommerceProductEntityFactoryStub.create.returns(new BigCommerceProductEntity(this._createBigCommerceProduct({is_free_shipping: 1}), bigCommerceConfigurationStub))
    const subjectUnderTest = new ShopgateProductShippingRepository(clientStub, bigCommerceProductEntityFactoryStub)
    const expectedShipping = new ShopgateProductShipping(0, 'USD')

    return subjectUnderTest.get(1).should.eventually.deep.equal(expectedShipping)
  })

  it('should provide free shipping when big commerce product has is_free_shipping set even though there is fixed_cost_shipping_price', () => {
    bigCommerceProductEntityFactoryStub.create.returns(new BigCommerceProductEntity(this._createBigCommerceProduct({is_free_shipping: 1, fixed_cost_shipping_price: 5.59}), bigCommerceConfigurationStub))
    const subjectUnderTest = new ShopgateProductShippingRepository(clientStub, bigCommerceProductEntityFactoryStub)
    const expectedShipping = new ShopgateProductShipping(0, 'USD')

    return subjectUnderTest.get(1).should.eventually.deep.equal(expectedShipping)
  })

  it('should provide free shipping when there is no free shipping available but the shipping price is 0', () => {
    bigCommerceProductEntityFactoryStub.create.returns(new BigCommerceProductEntity(this._createBigCommerceProduct({is_free_shipping: 0, fixed_cost_shipping_price: 0}), bigCommerceConfigurationStub))
    const subjectUnderTest = new ShopgateProductShippingRepository(clientStub, bigCommerceProductEntityFactoryStub)
    const expectedShipping = new ShopgateProductShipping(0, 'USD')

    return subjectUnderTest.get(1).should.eventually.deep.equal(expectedShipping)
  })

  it('should provide shipping price when there is no free shipping available', () => {
    bigCommerceProductEntityFactoryStub.create.returns(new BigCommerceProductEntity(this._createBigCommerceProduct({is_free_shipping: 0, fixed_cost_shipping_price: 5.59}), bigCommerceConfigurationStub))
    const subjectUnderTest = new ShopgateProductShippingRepository(clientStub, bigCommerceProductEntityFactoryStub)
    const expectedShipping = new ShopgateProductShipping(5.59, 'USD')

    return subjectUnderTest.get(1).should.eventually.deep.equal(expectedShipping)
  })

  /**
   * A solution to avoid having invalid inspection due to some js docs problems.
   * @param {*} bigCommerceProduct
   * @returns {*}
   */
  this._createBigCommerceProduct = (bigCommerceProduct) => {
    return bigCommerceProduct
  }
})
