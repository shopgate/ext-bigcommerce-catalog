const getProducts = require('../../products/getProducts.js')
const assert = require('assert')

describe('call get products', function () {
  let context = ''
  let input = {}
  let cb = function () {}

  getProducts(context, input, cb)
})
