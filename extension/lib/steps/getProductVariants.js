module.exports = async (context, input) => {
  let products = input.products
  let characteristics = input.characteristics
  return { products, characteristics }
}
