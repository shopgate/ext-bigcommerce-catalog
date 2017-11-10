/**
 * @param {object} context
 * @param {object} input - Properties depend on the pipeline this is used for
 *
 * @param {string} [input.categoryId]
 * @param {string} [input.searchPhrase]
 * @param {Object} [input.filters]
 * @param {int} [input.offset]
 * @param {int} [input.limit]
 * @param {string} [input.sort]
 * @param {boolean} [input.showInactive=false]
 * @param {string[]} [input.productIds]
 * @param {boolean} [input.characteristics]
 * @param {Function} cb
 */
module.exports = function (context, input, cb) {
    cb(null, {
        totalProductCount: 0,
        products: []
    })
}
