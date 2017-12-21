const ShopgateSort = require('../../catalog/product/value_objects/ShopgateSort.js')

module.exports = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  DEFAULT_SHOW_INACTIVE: false,
  DEFAULT_SORT: ShopgateSort.RANDOM // TODO remove reference into forein context
}
