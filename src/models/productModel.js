const products = require("../datos/products.json");

const productModel = {
    getSuggestedProducts: function(){
        return products.slice(0,5);
    }
}

module.exports = productModel;
