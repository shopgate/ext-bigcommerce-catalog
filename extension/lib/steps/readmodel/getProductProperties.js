/**
 * @typedef {Object} GetProductPropertiesInput
 * @property {number} productId
 */

/**
 * @typedef {Object} ShopgateProductProperty
 * @property {string} label
 * @property {*} value
 */

 /**
 * @callback GetProductPropertiesCallback
 * @property {Error} [error]
 * @property {ShopgateProductProperty[]} [properties]
 */
