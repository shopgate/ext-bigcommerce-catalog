/**
 * @typedef {Object} ShopgateProductPrice
 * @property {ShopgateProductPriceTier[]} [tiers]
 * @property {string} [info]
 * @property {number} [unitPrice]
 * @property {number} [unitPriceStriked]
 * @property {number} [unitPriceMin]
 * @property {number} [unitPriceMax]
 * @property {number} [unitPriceNet]
 * @property {number} [unitPriceWithTax]
 * @property {number} [taxAmount]
 * @property {number} [taxPercent]
 * @property {number} [msrp]
 * @property {string} [currency]
 */

/**
 * @typedef {Object} ShopgateProductCharacteristics
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {Object} ShopgateProductLiveShoppings
 * @property {string} from
 * @property {string} to
 */

/**
 * @typedef {Object} ShopgateProductFlags
 * @property {boolean} hasChildren
 * @property {boolean} hasVariants
 * @property {boolean} hasOptions
 */

/**
 * @typedef {Object} ShopgateProductPriceTier
 * @property {number} [from]
 * @property {number} [to]
 * @property {number} [unitPrice]
 */

/**
 * @typedef {Object} ShopgateProductIdentifiers
 * @property {string} sku
 * @property {string} ean
 * @property {string} isbn
 * @property {string} upc
 * @property {string} pzn
 * @property {string} mpn
 */

/**
 * @typedef {Object} ShopgateProductStock
 * @property {string} info
 * @property {boolean} orderable
 * @property {number} quantity
 * @property {number} [maxOrderQuantity]
 * @property {number} [minOrderQuantity]
 * @property {boolean} ignoreQuantity
 */

/**
 * @typedef {Object} ShopgateProductRating
 * @property {number} [count]
 * @property {number} [average]
 * @property {number} [reviewCount]
 */

/**
 * @typedef {Object} ShopgateProductAvailability
 * @property {string} text
 * @property {string} state
 */

/**
 * @typedef {Object} ProductAttributes
 * @property {ShopgateProductAvailability} availability
 * @property {string} name
 * @property {number} id
 * @property {boolean} active
 */

/**
 * @typedef {Object} ShopgateProductDefinition
 * @property {number} [id]
 * @property {boolean} [active]
 * @property {ShopgateProductAvailability} [availability]
 * @property {ShopgateProductIdentifiers} [identifiers]
 * @property {string} [manufacturer]
 * @property {string} [name]
 * @property {number} [ageRating]
 * @property {ShopgateProductStock} [stock]
 * @property {ShopgateProductRating} [rating]
 * @property {string} [featuredImageUrl]
 * @property {ShopgateProductPrice} [price]
 * @property {ShopgateProductFlags} [flags]
 * @property {ShopgateProductLiveShoppings} [liveshoppings]
 * @property {boolean} [highlight]
 * @property {ShopgateProductDefinition} [parent]
 * @property {ShopgateProductCharacteristics[]} [characteristics]
 * @property {string} [type]
 * @property {string} [tags]
 */

/**
 * @type ShopgateProductDefinition
 */
class ShopgateProduct {
  /**
   * @param {number} [id]
   * @param {boolean} [active]
   * @param {ShopgateProductAvailability} [availability]
   * @param {ShopgateProductIdentifiers} [identifiers]
   * @param {string} [manufacturer]
   * @param {string} [name]
   * @param {number} [ageRating]
   * @param {ShopgateProductStock} [stock]
   * @param {ShopgateProductRating} [rating]
   * @param {string} [featuredImageUrl]
   * @param {ShopgateProductPrice} [price]
   * @param {ShopgateProductFlags} [flags]
   * @param {ShopgateProductLiveShoppings} [liveshoppings]
   * @param {boolean} [highlight]
   * @param {ShopgateProductDefinition} [parent]
   * @param {ShopgateProductCharacteristics[]} [characteristics]
   * @param {string} [type]
   * @param {string} [tags]
   */
  constructor (/** @type {ShopgateProductDefinition} */{
    id, active, availability, identifiers, manufacturer, ageRating,
    name, stock, rating, featuredImageUrl, price, flags, highlight,
    liveshoppings, parent, characteristics, type, tags
  }) {
    this.id = id
    this.active = active
    this.availability = availability
    this.identifiers = identifiers
    this.manufacturer = manufacturer
    this.highlight = highlight
    this.name = name
    this.ageRating = ageRating
    this.stock = stock
    this.rating = rating
    this.featuredImageUrl = featuredImageUrl
    this.price = price
    this.flags = flags
    this.liveshoppings = liveshoppings
    this.parent = parent
    this.characteristics = characteristics
    this.type = type
    this.tags = tags
  }
}

module.exports = ShopgateProduct
