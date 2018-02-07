/**
 * @typedef {Object} AdditionalPropFilter
 * @property {number} [minimum]
 * @property {number} [maximum]
 * @property {string[]} [values]
 * @property {string} [source]
 */

/**
 * @typedef {Object} GetProductsInput
 * @property {string} [categoryId]
 * @property {string} [searchPhrase]
 * @property {number} [offset]
 * @property {number} [limit]
 * @property {string} [sort]
 * @property {boolean} [showInactive=false]
 * @property {string[]} [productIds]
 * @property {boolean} [characteristics]
 * @property {AdditionalPropFilter[]} [filters]
 */
