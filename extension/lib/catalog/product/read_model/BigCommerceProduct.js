/**
 * @typedef {Object} BigCommerceProduct
 * @property {?string} availability
 * @property {?string} availability_description
 * @property {?number} base_variant_id
 * @property {?string} bin_picking_number
 * @property {?string} brand_id
 * @property {?Array} bulk_pricing_rules
 * @property {number} calculated_price
 * @property {?Array} categories
 * @property {?string} condition
 * @property {?number} cost_price
 * @property {?Object} custom_url
 * @property {?boolean} is_customized
 * @property {?string} url
 * @property {?string} date_created
 * @property {?string} date_modified
 * @property {?number} depth
 * @property {?string} description
 * @property {?number} fixed_cost_shipping_price
 * @property {?Array} gift_wrapping_options_list
 * @property {?string} gift_wrapping_options_type
 * @property {?string} gtin
 * @property {number} height
 * @property {?number} id
 * @property {?BigCommerceProductImage[]} images
 * @property {?number} inventory_level
 * @property {?string} inventory_tracking
 * @property {?number} inventory_warning_level
 * @property {?boolean} is_condition_shown
 * @property {?boolean} is_featured
 * @property {?boolean} is_free_shipping
 * @property {?boolean} is_preorder_only
 * @property {?boolean} is_price_hidden
 * @property {?boolean} is_visible
 * @property {?string} layout_file
 * @property {?string} meta_description
 * @property {?Array} meta_keywords
 * @property {?string} mpn
 * @property {?string} name
 * @property {?string} option_set_display
 * @property {?number} option_set_id
 * @property {?number} order_quantity_maximum
 * @property {?number} order_quantity_minimum
 * @property {?string} page_title
 * @property {?string} preorder_message
 * @property {?string} preorder_release_date
 * @property {?number} price
 * @property {?string} price_hidden_label
 * @property {?string} product_tax_code
 * @property {?number[]} related_products
 * @property {?number} retail_price
 * @property {?number} reviews_count
 * @property {?number} reviews_rating_sum
 * @property {?number} sale_price
 * @property {?string} search_keywords
 * @property {?string} sku
 * @property {?number} sort_order
 * @property {?number} tax_class_id
 * @property {?number} total_sold
 * @property {?string} type
 * @property {?string} upc
 * @property {?BigCommerceProductVariant[]} variants
 * @property {?number} view_count
 * @property {?string} warranty
 * @property {?number} weight
 * @property {?number} width
 */

 /**
  * Takes into account `inventory_tracking` param where
  * the Qty is tracked based on the configuration set in
  * the Inventry Tracking section of the product page
  * - None means no Qty tracking is made at all
  * - Product means that the parent product has a base qty set
  * - Variant means the variants have different Qty's assigned
  */
module.exports.Inventory = {
  TRACKING_OFF: 'none',
  TRACKING_PRODUCT: 'product',
  TRACKING_VARIANT: 'variant'
}

module.exports.Availability = {
  AVAILABLE: 'available',
  DISABLED: 'disabled',
  PREORDER: 'preorder'
}
