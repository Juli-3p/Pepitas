const productModel = require("../models/productModel");
const product = require("../datos/products.json");

const productController = {
    home: (req, res) => {
        const suggestedProducts = productModel.getSuggestedProducts();
        const featuredProducts = productModel.getFeaturedProducts();
        res.render("paginas/index", { suggestedProducts, featuredProducts });
    },
    category: (req, res) => {
        const categorySlug = decodeURIComponent(req.params.category || '').trim().toLowerCase();
        const products = productModel.getProductsByCategorySlug(categorySlug);
        const categoryName = products.length > 0
            ? products[0].category
            : categorySlug.replace(/-/g, ' ');
        res.render("paginas/categories", { categoryName, products });
    },
    detail: (req, res) => {
        res.send("detalle");
    },
    vistProd: (req, res) => {
        res.render("paginas/vistProd");
    }

}


module.exports = productController;