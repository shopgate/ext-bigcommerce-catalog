const ShopgateCategory = require('../../../../../../../extension/lib/catalog/category/Entity/ShopgateCategory')
const ShopgateParentCategoryInformation = require('../../../../../../../extension/lib/catalog/category/Entity/ShopgateParentCategoryInformation')
const assert = require('assert')

describe('ShopgateCategory', () => {
  let subjectUnderTest
  beforeEach(() => {
    subjectUnderTest = new ShopgateCategory(
      '11',
      'Test category',
      'http://www.shopgate.com',
      new ShopgateParentCategoryInformation('5', 'Parent'),
      10,
      0,
      []
    )
  })

  it('should create ShopgateCategory when toShopgateCategory is invoked', () => {
    const expectedShopgateCategoryResponse = {
      children: [],
      childrenCount: 0,
      id: '11',
      imageUrl: 'http://www.shopgate.com',
      name: 'Test category',
      parent: {
        id: '5',
        name: 'Parent'
      },
      productCount: 10
    }

    const actualShopgateCategoryResponse = subjectUnderTest.toShopgateCategory()

    assert.deepEqual(actualShopgateCategoryResponse, expectedShopgateCategoryResponse)
  })

  it('should create ShopgateChildCategory when toShopgateChildCategory is invoked', () => {
    const expectedShopgateChildCategoryResponse = {
      id: '11',
      imageUrl: 'http://www.shopgate.com',
      name: 'Test category',
      parent: {
        id: '5',
        name: 'Parent'
      },
      productCount: 10
    }

    const actualShopgateChildCategoryResponse = subjectUnderTest.toShopgateChildCategory()

    assert.deepEqual(expectedShopgateChildCategoryResponse, actualShopgateChildCategoryResponse)
  })
})
