const ProductDescriptionRepository = require('../catalog/ShopgateProductDescriptionRepository.js')
const BigComerceFactory = require('./BigCommerceFactory.js')

module.exports = function (context, input, cb) {
  if (!input.hasOwnProperty('productId')) {
    cb(null, {description: ''})
    return
  }
  const bigComerceFactory = new BigComerceFactory()
  const productDescriptionRepository = new ProductDescriptionRepository(bigComerceFactory.createV3(
    context.config.clientId,
    context.config.accessToken,
    context.config.storeHash))

  productDescriptionRepository.getProductDescriptionById(
    input.productId
  ).then(descriptionResult => {
    cb(null, descriptionResult
  )
    }).
      catch(error => {
        context.log.error('Unable to get description for productIds: ' + input.productId, error)
        cb(error)
    })
}

