/**
 * @typedef {Object} GetProductPropertiesInput
 * @property {number} productId
 */

/**
 * @typedef {Object} ShopgateProductProperty
 * @property {string} label
 * @property {string} value
 */

/**
 * @callback GetProductPropertiesCallback
 * @param {Error} [error]
 * @param {ShopgateProductProperty[]} [properties]
 */
