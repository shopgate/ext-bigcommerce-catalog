const ShopgateParentCategoryInformation = require('./ShopgateParentCategoryInformation')

/**
 * @property {string} _id
 * @property {string} _name
 * @property {string} _imageUrl
 * @property {ShopgateParentCategoryInformation} _parent
 * @property {number} _productCount
 * @property {number} _childrenCount
 * @property {ShopgateCategory[]} children
 */
class ShopgateCategory {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} imageUrl
   * @param {ShopgateParentCategoryInformation|null} [parent]
   * @param {number} [productCount]
   * @param {number} [childrenCount]
   * @param {ShopgateCategory[]} [children]
   */
  constructor (id, name, imageUrl, parent = null, productCount = 1, childrenCount = 0, children = []) {
    this._id = id
    this._name = name
    this._imageUrl = imageUrl
    this._parent = parent
    this._productCount = productCount
    this._childrenCount = childrenCount
    this._children = children
  }

  /**
   * @returns {string}
   */
  get id () {
    return this._id
  }

  /**
   * @returns {string}
   */
  get name () {
    return this._name
  }

  /**
   * @returns {string}
   */
  get imageUrl () {
    return this._imageUrl
  }

  /**
   * @returns {ShopgateParentCategoryInformation}
   */
  get parent () {
    return this._parent
  }

  /**
   * @returns {number}
   */
  get productCount () {
    return this._productCount
  }

  /**
   * @returns {number}
   */
  get childrenCount () {
    return this._childrenCount
  }

  /**
   * @returns {ShopgateCategory[]}
   */
  get children () {
    return this._children
  }

  /**
   * @param {BigCommerceCategory} bigCommerceCategory
   * @param {number} [productCount]
   * @param {number} [childrenCount]
   * @param {ShopgateCategory[]} [children]
   *
   * @return {ShopgateCategory}
   */
  static fromBigcommerceCategory (bigCommerceCategory, productCount = 1, childrenCount = 0, children = []) {
    let parentCategory
    if (bigCommerceCategory.hasOwnProperty('parent_id')) {
      parentCategory = new ShopgateParentCategoryInformation(bigCommerceCategory.parent_id.toString(), '')
    }

    return new this(
      bigCommerceCategory.id,
      bigCommerceCategory.name,
      bigCommerceCategory.image_url,
      parentCategory,
      productCount,
      childrenCount,
      children
    )
  }

  /**
   * @return {ShopgateRootCategory}
   */
  toShopgateRootCategory () {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl,
      productCount: this.productCount
    }
  }

  /**
   * @return {ShopgateCategoryChild}
   */
  toShopgateChildCategory () {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl,
      productCount: this.productCount,
      parent: this.parent.toShopgateParentCategory()
    }
  }

  /**
   * @return {ShopgateCategory}
   */
  toShopgateCategory () {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl,
      parent: this.parent.toShopgateParentCategory(),
      productCount: this.productCount,
      childrenCount: this.childrenCount,
      children: this.children
    }
  }
}

module.exports = ShopgateCategory
