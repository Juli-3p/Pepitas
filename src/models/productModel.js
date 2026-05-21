const products = require("../datos/products.json");

const productModel = {
    getSuggestedProducts(){
   const shuffled =
      [...products].sort(
         () => 0.5 - Math.random()
      )
   return shuffled.slice(0, 5)
}
}

module.exports = productModel;
