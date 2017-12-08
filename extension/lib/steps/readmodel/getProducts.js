/**
 * @callback GetProductsPipelineCallback
 * @param {Error} [error]
 * @param {ShopgateProductsResponse} [productsResponse]
 */

/**
 * @typedef {Object} AdditionalPropFilter
 * @property {number} [input.filters.additionalProp1.minimum]
 * @property {number} [input.filters.additionalProp1.maximum]
 * @property {string[]} [input.filters.additionalProp1.values]
 * @property {string} [input.filters.additionalProp1.source]
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
