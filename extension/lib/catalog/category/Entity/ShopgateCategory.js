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
   * @param {ShopgateParentCategoryInformation|null} parent
   * @param {number} productCount
   * @param {number} childrenCount
   * @param {ShopgateCategory[]} children
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

  get id () {
    return this._id
  }

  get name () {
    return this._name
  }

  get imageUrl () {
    return this._imageUrl
  }

  get parent () {
    return this._parent
  }

  get productCount () {
    return this._productCount
  }

  get childrenCount () {
    return this._childrenCount
  }

  get children () {
    return this._children
  }

  /**
   * @param {BigcommerceCategory} bigcommerceCategory
   * @param {number} productCount
   * @param {number} childrenCount
   * @param {ShopgateCategory[]} children
   *
   * @return {ShopgateCategory}
   */
  static fromBigcommerceCategory (bigcommerceCategory, productCount = 1, childrenCount = 0, children = []) {
    let parentCategory
    if (bigcommerceCategory.hasOwnProperty('parent_id')) {
      parentCategory = new ShopgateParentCategoryInformation(bigcommerceCategory.parent_id.toString(), '')
    }

    return new this(
      bigcommerceCategory.id,
      bigcommerceCategory.name,
      bigcommerceCategory.image_url,
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
      parent: this.parent
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
      parent: this.parent,
      productCount: this.productCount,
      childrenCount: this.childrenCount,
      children: this.children
    }
  }
}

module.exports = ShopgateCategory
