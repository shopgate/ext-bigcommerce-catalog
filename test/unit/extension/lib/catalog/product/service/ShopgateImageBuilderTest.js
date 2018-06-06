const ShopgateImageBuilder = require('../../../../../../../extension/lib/catalog/product/service/ShopgateImageBuilder')
const assert = require('assert')

describe('Shopgate Image Builder > ', () => {
  let tempProduct = (tempVariant = {})
  beforeEach(() => {
    tempProduct = {id: 1, images: [], variants: []}
    tempVariant = {id: 2, image_url: ''}
  })
  describe('Parent > ', () => {
    it('Returns parent image array if entries are not empty', function() {
      const expectedImages = ['1.jpg', '2.jpg']
      tempProduct.images = [{url_standard: '1.jpg'}, {url_standard: ''}, {url_standard: '2.jpg'}]

      const returns = new ShopgateImageBuilder(tempProduct, 0).build()

      assert.deepEqual(returns.images, expectedImages)
    })

    it('Returns and empty array if there are no parent images', function() {
      const returns = new ShopgateImageBuilder(tempProduct, 0).build()

      assert.deepEqual(returns.images, [])
    })
  })

  describe('Variants > ', () => {
    it('Returns parent images if no variants exist', function() {
      const expectedImages = ['1.jpg', '2.jpg']
      tempProduct.images = [{url_standard: '1.jpg'}, {url_standard: '2.jpg'}]

      const returns = new ShopgateImageBuilder(tempProduct, 2).build()

      assert.deepEqual(returns.images, expectedImages)
    })

    it('Returns parent images if no variant images are set', function() {
      const expectedImages = ['1.jpg', '2.jpg']
      tempProduct.images = [{url_standard: '1.jpg'}, {url_standard: '2.jpg'}]
      tempProduct.variants = [tempVariant]

      const returns = new ShopgateImageBuilder(tempProduct, 2).build()

      assert.deepEqual(returns.images, expectedImages)
    })

    it('Should display the variant image only', function() {
      tempProduct.images = [{url_standard: '1.jpg'}, {url_standard: '2.jpg'}]
      tempVariant.image_url = '3.jpg'
      tempProduct.variants = [tempVariant]

      const returns = new ShopgateImageBuilder(tempProduct, 2).build()

      assert.deepEqual(returns.images, ['3.jpg'])
    })

    it('Should display the correct variant image', function() {
      tempProduct.images = [{url_standard: '1.jpg'}, {url_standard: '2.jpg'}]
      tempVariant.image_url = '3.jpg'
      tempProduct.variants = [tempVariant, {id: 3, image_url: '4.jpg'}]

      const returns = new ShopgateImageBuilder(tempProduct, 3).build()

      assert.deepEqual(returns.images, ['4.jpg'])
    })
  })
})
