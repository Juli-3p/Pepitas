const productModel = require("../models/productModel");

const productController = {
    home: (req, res) => {
        const suggestedProducts = productModel.getSuggestedProducts();
        res.render("paginas/index", {suggestedProducts});
    }
}

module.exports = productController;