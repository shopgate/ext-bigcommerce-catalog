const ProductDescriptionRepository = require('../catalog/product/ShopgateDescriptionRepository.js')
const BigComerceFactory = require('./BigCommerceFactory.js')

module.exports = function (context, input, cb) {
  if (!input.hasOwnProperty('productId')) {
    cb(null, {description: ''})
    return
  }
  const bigCommerceFactory = new BigComerceFactory(context.config.clientId, context.config.accessToken, context.config.storeHash)
  const productDescriptionRepository = new ProductDescriptionRepository(bigCommerceFactory.createV3())

  productDescriptionRepository.get(
    input.productId
  ).then(descriptionResult => {
    cb(null, {description: descriptionResult})
  }).catch(error => {
    context.log.error('Unable to get description for productId: ' + input.productId, error)
    cb(error)
  })
}
