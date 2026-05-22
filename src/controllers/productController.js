const productModel = require("../models/productModel");

const productController = {

    home: (req, res) => {
        const suggestedProducts = productModel.getSuggestedProducts();
        const featuredProducts = productModel.getFeaturedProducts();
        res.render("paginas/index", {
            css: "index",
            suggestedProducts,
            featuredProducts
        });
    },
    category: (req, res) => {
        const categorySlug = decodeURIComponent(req.params.category || '')
            .trim()
            .toLowerCase();
        const products =
            productModel.getProductsByCategorySlug(categorySlug);
        const categoryName = products.length > 0
            ? products[0].category
            : categorySlug.replace(/-/g, ' ');
        res.render("paginas/categories", {
            categoryName,
            products
        });
    },
    detail: (req, res) => {
        const id = req.params.id;
        const product = productModel.getProductById(id);
        if (!product) {
            return res.status(404).render("paginas/404");
        }
        const relatedProducts =
            productModel
                .getProductsByCategorySlug(product.category.toLowerCase())
                .filter(p => p.id != product.id)
                .slice(0, 4);
        res.render("paginas/vistProd", {
            css: "vistProd",
            product,
            relatedProducts
        });
    },
    vistProd: (req, res) => {
        const relatedProducts =
            productModel.getFeaturedProducts();
        res.render("paginas/vistProd", {
            css: "vistProd",
            relatedProducts
        });
    }
};

module.exports = productController;