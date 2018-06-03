const ShopgateVariantBuilder = require('../../../../../../../extension/lib/catalog/product/service/ShopgateVariantBuilder')
const BigCommerceProduct = require('../../../../../../../extension/lib/catalog/product/read_model/BigCommerceProduct')
const assert = require('assert').strict

describe('Variant Builder > ', () => {
  let tempProduct = tempVariant = {}
  beforeEach(() => {
    tempProduct = { id: 1, variants: [{ id: 1 }] }
    tempVariant = { id: 2 }
  })

  it('Should produce a proper variant ID', () => {
    const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
    assert.equal(resultProduct.id, `${tempProduct.id}-${tempVariant.id}`)
  })

  it('Does not have options yet', () => {
    const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
    assert.equal(resultProduct.hasOptions, false)
  })

  describe('Characterisits > ', () => {
    beforeEach(() => {
      tempVariant = {
        id: 2,
        option_values: [
          {
            'id': 72,
            'label': 'XL',
            'option_id': 230,
            'option_display_name': 'Size'
          },
          {
            'id': 8,
            'label': 'Black',
            'option_id': 231,
            'option_display_name': 'Color'
          }]
      }
    })

    it('Should match all variant option id\'s', () => {
      const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
      assert.deepEqual(resultProduct.characteristics, { '230': '72', '231': '8' })
    })

    it('Should should produce an empty list if no variants are found', () => {
      tempVariant.option_values = []
      const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
      assert.deepEqual(resultProduct.characteristics, {})
    })
  })

  describe('Stock > ', () => {
    describe('Purchasability of a product', () => {
      beforeEach(() => {
        tempProduct = { 
          id: 1,
          inventory_tracking: BigCommerceProduct.Inventory.TRACKING_OFF,
          inventory_level: 0,
          variants: [{ id: 1, purchasing_disabled: false }] 
        }
        tempVariant = { id: 2, purchasing_disabled: false, inventory_level: 0 }
      })
  
      it('Is orderable when tracking is off and no quantity', () => {
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.ok(resultProduct.stock.orderable)
      })

      it('Is orderable when tracking is parent and parent has quantity more than 0', () => {
        tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_PRODUCT
        tempProduct.inventory_level = 1
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.ok(resultProduct.stock.orderable)
      })

      it('Is orderable when tracking is variant and variant has quantity more than 0', () => {
        tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_VARIANT
        tempVariant.inventory_level = 1
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.ok(resultProduct.stock.orderable)
      })

      it('Is NOT orderable when tracking is parent and parent has quantity 0', () => {
        tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_PRODUCT
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.orderable, false)
      })

      it('Is NOT orderable when tracking is variant and variant has quantity 0', () => {
        tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_VARIANT
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.orderable, false)
      })

      it('Is NOT orderable when tracking is off and purchasing is disabled', () => {
        tempProduct.variants[0].purchasing_disabled = tempVariant.purchasing_disabled = true
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.orderable, false)
      })
    
      it('Is NOT orderable when tracking is parent and purchasing is disabled', () => {
        tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_PRODUCT
        tempProduct.variants[0].purchasing_disabled = tempVariant.purchasing_disabled = true
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.orderable, false)
      })

      it('Is NOT orderable when tracking is variant and purchasing is disabled', () => {
        tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_VARIANT
        tempProduct.variants[0].purchasing_disabled = tempVariant.purchasing_disabled = true
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
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

      it('Should use the variant\'s Qty when nothing is tracked', () => {
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.quantity, tempVariant.inventory_level)
        assert.equal(resultProduct.stock.ignoreQuantity, true)
      })

      it('Should track the parents Qty when tracking it', () => {
        tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_PRODUCT
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.quantity, tempProduct.inventory_level)
        assert.equal(resultProduct.stock.ignoreQuantity, false)
      })

      it('Should track the variants Qty when tracking it', () => {
        tempProduct.inventory_tracking = BigCommerceProduct.Inventory.TRACKING_VARIANT
        tempProduct.variants.push(tempVariant)
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.quantity, tempVariant.inventory_level)
        assert.equal(resultProduct.stock.ignoreQuantity, false)
      })

      it('Should ignore quantity despite it being a variant', () => {
        tempProduct.variants.push(tempVariant)
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
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
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.minOrderQuantity, 0)
        assert.equal(resultProduct.stock.maxOrderQuantity, 0)
      })

      it('Should have a min/max order qty when set', () => {
        tempProduct.order_quantity_minimum = 2
        tempProduct.order_quantity_maximum = 10
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.minOrderQuantity, 2)
        assert.equal(resultProduct.stock.maxOrderQuantity, 10)
      })

      it('Being a variant has no effect on min/max order qty', () => {
        tempProduct.order_quantity_minimum = 2
        tempProduct.order_quantity_maximum = 10
        tempProduct.variants.push(tempVariant)
        const resultProduct = new ShopgateVariantBuilder(tempProduct, tempVariant).build()
        assert.equal(resultProduct.stock.minOrderQuantity, 2)
        assert.equal(resultProduct.stock.maxOrderQuantity, 10)
      })
    })
  })
})
