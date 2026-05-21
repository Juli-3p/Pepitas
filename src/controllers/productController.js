const productModel = require("../models/productModel");

const productController = {
    home: (req, res) => {
        const suggestedProducts = productModel.getSuggestedProducts();
        const featuredProducts = productModel.getFeaturedProducts();
        res.render("paginas/index", { suggestedProducts, featuredProducts });
    }

}

module.exports = productController;