const ParentCategoryInformation = require('./ParentCategoryInformation')

class Category {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} imageUrl
   * @param {ParentCategoryInformation|null} [parent]
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
   * @returns {ParentCategoryInformation}
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
   * @returns {Category[]}
   */
  get children () {
    return this._children
  }

  /**
   * @param {BigCommerceCategory} bigCommerceCategory
   * @param {number} [productCount]
   * @param {number} [childrenCount]
   * @param {Category[]} [children]
   *
   * @return {Category}
   */
  static fromBigcommerceCategory (bigCommerceCategory, productCount = 1, childrenCount = 0, children = []) {
    let parentCategory
    if (bigCommerceCategory.hasOwnProperty('parent_id')) {
      parentCategory = new ParentCategoryInformation(bigCommerceCategory.parent_id.toString(), '')
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
      productCount: this.productCount
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
      children: this.children.map(child => child.toShopgateChildCategory())
    }
  }
}

module.exports = Category
