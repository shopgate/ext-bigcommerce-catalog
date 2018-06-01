const ShopgateProductBuilder = require('../../../../../../../extension/lib/catalog/product/service/ShopgateProductBuilder')
const ShopgateProduct = require('../../../../../../../extension/lib/catalog/product/entity/ShopgateProduct')
const ShopgateType = require('../../../../../../../extension/lib/catalog/product/value_objects/ShopgateType')
const BigCommerceProduct = require('../../../../../../../extension/lib/catalog/product/read_model/BigCommerceProduct')
const assert = require('assert').strict

describe('Shopgate product builder ', () => {
  it('buildes ShopgateProduct for provided bigcommerce data', () => {
    const productBuilder = new ShopgateProductBuilder({ id: 11, variants: [{ id: 1 }] }, '', 0)

    assert.ok(productBuilder.build() instanceof ShopgateProduct)
  })
})

describe('Product types are correct in all three scenarios', () => {

  it('Parent product if it has more than 1 variant', () => {
    const resultProduct = new ShopgateProductBuilder({ id: 11, variants: [{ id: 1 }, { id: 2 }] }, '', 0).build()
    assert.equal(resultProduct.type, ShopgateType.PARENT)
  })

  it('Simple product if it only has 1 variant', () => {
    const resultProduct = new ShopgateProductBuilder({ id: 11, variants: [{ id: 1 }] }, '', 0).build()
    assert.equal(resultProduct.type, ShopgateType.SIMPLE)
  })

  it('Variant product if it has more than 1 variant & a variantId passed', () => {
    const resultProduct = new ShopgateProductBuilder({ id: 11, variants: [{ id: 1 }, { id: 2 }] }, '', 1).build()
    assert.equal(resultProduct.type, ShopgateType.VARIANT)
  })

  it('Variant product if it has 1 variant & a variantId passed', () => {
    const resultProduct = new ShopgateProductBuilder({ id: 11, variants: [{ id: 1 }] }, '', 1).build()
    assert.equal(resultProduct.type, ShopgateType.VARIANT)
  })
})

describe('Pricing related tests: ', () => {
  let tempProduct = tempVariant = {}
  beforeEach(() => {
    tempProduct = { id: 1, price: 100, calculated_price: 95, variants: [{ id: 1 }] }
    tempVariant = { id: 2, price: 90, calculated_price: 10 }
  })

  describe('Produce prices should be correctly assigned', () => {
    it('Parent price should be displayed when no variant is selected', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()

      assert.equal(resultProduct.price.unitPrice, tempProduct.calculated_price)
      assert.equal(resultProduct.price.unitPriceNet, tempProduct.calculated_price)
      assert.equal(resultProduct.price.unitPriceWithTax, tempProduct.calculated_price)
    })

    it('Variant price should be displayed when a vairant is selected', () => {
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 2).build()

      assert.equal(resultProduct.price.unitPrice, tempVariant.calculated_price)
      assert.equal(resultProduct.price.unitPriceNet, tempVariant.calculated_price)
      assert.equal(resultProduct.price.unitPriceWithTax, tempVariant.calculated_price)
    })
  })

  describe('It should use the correct currency of the store', () => {

    it('Correct currency is used to price the product: USD', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, 'USD', 0).build()
      assert.equal(resultProduct.price.currency, 'USD')
    })

    it('Correct currency is used to price the product: EUR', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, 'EUR', 0).build()
      assert.equal(resultProduct.price.currency, 'EUR')
    })
  })

  describe('Price strikken out due to discount', () => {

    it('Should strike out the parent\'s original price as it\'s higher than the original', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.price.unitPriceStriked, tempProduct.price)
    })

    it('Should strike out the variant\'s original price as it\'s higher than the original', () => {
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 2).build()
      assert.equal(resultProduct.price.unitPriceStriked, tempVariant.price)
    })
  })
})

describe('Pipeline firing flags: ', () => {
  let tempProduct = tempVariant = {}

  beforeEach(() => {
    tempProduct = { id: 1, variants: [{ id: 1 }] }
    tempVariant = { id: 2 }
  })

  describe('Checks if product hasVariants flag is set correctly', () => {
    it('Should not have variants as it is a Parent product with 1 variant', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.flags.hasVariants, false)
    })

    it('Should have variants as it is a Parent product with more than 1 variant', () => {
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.ok(resultProduct.flags.hasVariants)
    })

    it('Should not have variants as it is a Variant product ID:1', () => {
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 1).build()
      assert.equal(resultProduct.flags.hasVariants, false)
    })

    it('Should not have variants as it is a Variant product ID:2', () => {
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 2).build()
      assert.equal(resultProduct.flags.hasVariants, false)
    })
  })

  describe('Options and children flags', () => {
    it('Should have both flags off as they are not implemented', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.flags.hasChildren, false)
      assert.equal(resultProduct.flags.hasOptions, false)
    })
  })
})

describe('Stock levels: ', () => {
  let tempProduct = tempVariant = {}

  describe('Purchasability of a product', () => {
    beforeEach(() => {
      tempProduct = { id: 1, variants: [{ id: 1, purchasing_disabled: false }] }
      tempVariant = { id: 2, purchasing_disabled: false }
    })

    it('Should be orderable if Parent\'s variant is not disabled', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.ok(resultProduct.stock.orderable)
    })

    it('Should be orderable if neither variants are disabled', () => {
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.ok(resultProduct.stock.orderable)
    })

    it('Should be orderable if  at least one variant is enabled', () => {
      tempVariant.purchasing_disabled = true
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.ok(resultProduct.stock.orderable)
    })

    it('Should be not be orderable if the only variant is disabled', () => {
      tempProduct.variants[0].purchasing_disabled = true
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.stock.orderable, false)
    })

    it('Should be not be orderable if all variants are disabled', () => {
      tempProduct.variants.push(tempVariant)
      tempProduct.variants.map(variant => variant.purchasing_disabled = true)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.stock.orderable, false)
    })
  })

  describe('Quantity of a product', () => {
    beforeEach(() => {
      tempProduct = {
        id: 1,
        inventory_tracking: BigCommerceProduct.Inventory.TRACKING_OFF,
        inventory_level: 5,
        variants: [{ id: 1, inventory_level: 10 }]
      }
      tempVariant = { id: 2, inventory_level: 15 }
    })

    it('Should use the parent\'s Qty when not tracking', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.stock.quantity, tempProduct.inventory_level)
      assert.equal(resultProduct.stock.ignoreQuantity, true)
    })

    it('Should track the parents Qty when tracking it', () => {
      tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_PRODUCT
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.stock.quantity, tempProduct.inventory_level)
      assert.equal(resultProduct.stock.ignoreQuantity, false)
    })

    it('Should track the variants Qty when tracking it, ID:1', () => {
      tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_VARIANT
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 1).build()
      assert.equal(resultProduct.stock.quantity, tempProduct.variants[0].inventory_level)
      assert.equal(resultProduct.stock.ignoreQuantity, false)
    })

    it('Should track the variants Qty when tracking it, ID:2', () => {
      tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_VARIANT
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 2).build()
      assert.equal(resultProduct.stock.quantity, tempVariant.inventory_level)
      assert.equal(resultProduct.stock.ignoreQuantity, false)
    })

    it('Should ignore quantity despite it being a variant', () => {
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 2).build()
      assert.equal(resultProduct.stock.ignoreQuantity, true)
    })
  })

  describe('Order min/max allowances', () => {
    beforeEach(() => {
      tempProduct = {
        id: 1,
        order_quantity_minimum: 0,
        order_quantity_maximum: 0,
        variants: [{ id: 1 }]
      }
      tempVariant = { id: 2 }
    })

    it('Should not have a min/max order qty when not set', () => {
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.stock.minOrderQuantity, 0)
      assert.equal(resultProduct.stock.maxOrderQuantity, 0)
    })

    it('Should have a min/max order qty when set', () => {
      tempProduct.order_quantity_minimum = 2
      tempProduct.order_quantity_maximum = 10
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 0).build()
      assert.equal(resultProduct.stock.minOrderQuantity, 2)
      assert.equal(resultProduct.stock.maxOrderQuantity, 10)
    })

    it('Being a variant has no effect on min/max order qty', () => {
      tempProduct.order_quantity_minimum = 2
      tempProduct.order_quantity_maximum = 10
      tempProduct.variants.push(tempVariant)
      const resultProduct = new ShopgateProductBuilder(tempProduct, '', 2).build()
      assert.equal(resultProduct.stock.minOrderQuantity, 2)
      assert.equal(resultProduct.stock.maxOrderQuantity, 10)
    })
  })
})