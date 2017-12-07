/**
 * @callback GetProductsPipelineCallback
 * @param {Error} [errorMessage]
 * @param {Object} [responseObject]
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
 * @property {Object} [filters]
 * @property {AdditionalPropFilter} [filters.additionalProp1]
 * @property {AdditionalPropFilter} [filters.additionalProp2]
 * @property {AdditionalPropFilter} [filters.additionalProp3]
 */
