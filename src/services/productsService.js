const db = require("../../db/database");

const productsService = {
    getAllProducts: () => {
        return db.prepare("SELECT * FROM products").all();
    },
    getSuggestedProducts: () => {
        return db.prepare(`SELECT * FROM products WHERE stock > 0 LIMIT 4`).all();
    },
    getFeaturedProducts: () => {
        return db.prepare(`SELECT * FROM products WHERE featured = 1`).all();
    },
    getProductsByCategorySlug: (category) => {
        return db.prepare(`SELECT * FROM products WHERE LOWER(category) = LOWER(?)`).all(category);
    },
    getProductById: (id) => {
        return db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
    },
    searchProducts: (query) => {

        if (!query) return [];
        return db.prepare(`SELECT * FROM products WHERE LOWER(name) LIKE LOWER(?)`).all(`%${query}%`);
    },
    sortByPriceAsc: (products) => {
        return [...products].sort((a, b) => a.price - b.price);
    },
    sortByPriceDesc: (products) => {
        return [...products].sort((a, b) => b.price - a.price);
    }
};

module.exports = productsService;
