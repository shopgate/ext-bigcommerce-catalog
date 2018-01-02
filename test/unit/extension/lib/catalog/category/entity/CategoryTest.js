const Category = require('../../../../../../../extension/lib/catalog/category/entity/Category')
const ParentCategoryInformation = require('../../../../../../../extension/lib/catalog/category/entity/ParentCategoryInformation')
const assert = require('assert')

describe('Category', () => {
  let subjectUnderTest
  beforeEach(() => {
    subjectUnderTest = new Category(
      '11',
      'Test category',
      'http://www.shopgate.com',
      new ParentCategoryInformation('5', 'Parent'),
      10,
      0,
      []
    )
  })

  it('should create Category when toShopgateCategory is invoked', () => {
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
      productCount: 10
    }

    const actualShopgateChildCategoryResponse = subjectUnderTest.toShopgateChildCategory()

    assert.deepEqual(expectedShopgateChildCategoryResponse, actualShopgateChildCategoryResponse)
  })
})
