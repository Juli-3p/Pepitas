const products = require("../datos/products.json");

const productsService = {
    getAllProducts: () => {
        return products;
    },
    getSuggestedProducts: () => {
        return products.filter(product => product.stock > 0).slice(0, 4);
    },
    getFeaturedProducts: () => {
        return products.filter(product => product.featured);
    },
    getProductsByCategorySlug: (category) => {
        return products.filter(
            product =>
                product.category.toLowerCase() ===
                category.toLowerCase()
        );
    },

    getProductById: (id) => {
        return products.find(
            product => Number(product.id) === Number(id)
        );
    },

    sortByPriceAsc: (products) => {
        return [...products].sort(
            (a, b) => a.price - b.price
        );
    },

    sortByPriceDesc: (products) => {
        return [...products].sort(
            (a, b) => b.price - a.price
        );
    }
};

module.exports = productsService;
