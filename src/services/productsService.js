const products = require("../datos/products.json");

const productsService = {

    getAllProducts: () => {
        return products;
    },

    getProductById: (id) => {
        return products.find(
            product => Number(product.id) === Number(id)
        );
    },

    getFeaturedProducts: () => {
        return products.filter(
            product => product.featured
        );
    },

    getProductsByCategorySlug: (category) => {

        return products.filter(
            product =>
                product.category.toLowerCase() ===
                category.toLowerCase()
        );

    },

    getSuggestedProducts: () => {

        return products
            .filter(product => product.stock > 0)
            .slice(0, 4);

    }

};

module.exports = productsService;
