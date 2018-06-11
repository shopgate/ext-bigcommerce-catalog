const assert = require('assert')
const Credentials = require('../../../../../.integration-credentials.js')
const getProductsPipeline = require('../../../../../extension/lib/steps/getProducts')

/**
 * These will fail if these products are removed from the system :)
 */
describe('getProducts step > ', () => {
  const featuredProducts = ['69', '77', '97']
  const context = {
    config: {
      clientId: Credentials.clientId,
      accessToken: Credentials.accessToken,
      storeHash: Credentials.storeHash
    },
    log: {
      info: () => {},
      error: () => {},
      debug: () => {}
    }
  }
  let input = {}
  beforeEach(() => {
    input = {
      productIds: ['94', '87', '86', ...featuredProducts]
    }
  })

  describe('Highlights > ', () => {
    it('Should return all products when it is not a getHighlight pipeline call', async () => {
      const result = await getProductsPipeline(context, input)
      assert.equal(result.products.length, input.productIds.length)
      assert.equal(result.totalProductCount, input.productIds.length)
    })
    it('Should return no products when highlight returning is skipped', async () => {
      input.skipHighlightLoading = true
      const result = await getProductsPipeline(context, input)
      assert.equal(result.products.length, 0)
      assert.equal(result.totalProductCount, 0)
    })
    it('Should return only highlight products', async () => {
      input.skipHighlightLoading = false
      const result = await getProductsPipeline(context, input)
      assert.equal(result.products.length, 3)
      assert.equal(result.totalProductCount, 3)
      assert.equal(result.products[0].highlight, true)
    })
  })
})
