const db = require("../../db/database");

const productsService = {
    getAllProducts: () => {

        return db.prepare(`
            SELECT
                id,
                name,
                description,
                price,
                stock,
                image_url AS image,
                active
            FROM products
        `).all();

    },
    getSuggestedProducts: () => {

        return db.prepare(`
            SELECT
                id,
                name,
                description,
                price,
                stock,
                image_url AS image,
                active
            FROM products
            WHERE stock > 0
            LIMIT 4
        `).all();

    },
    getFeaturedProducts: () => {

        const stmt = db.prepare(`
            SELECT *
            FROM products
            WHERE featured = 1
        `);

        return stmt.all();
    },
    getProductsByCategorySlug: (category) => {

        return db.prepare(`
            SELECT
                products.id,
                products.name,
                products.description,
                products.price,
                products.stock,
                products.image_url AS image,
                products.active,
                categories.name AS category
            FROM products
            JOIN categories
                ON products.category_id = categories.id
            WHERE LOWER(categories.name) = LOWER(?)
        `).all(category);

    },

    getProductById: (id) => {

        return db.prepare(`
            SELECT
                id,
                name,
                description,
                price,
                stock,
                image_url AS image,
                active
            FROM products
            WHERE id = ?
        `).get(id);

    },
    searchProducts: (query) => {

        if (!query) return [];

        return db.prepare(`
            SELECT
                id,
                name,
                description,
                price,
                stock,
                image_url AS image,
                active
            FROM products
            WHERE LOWER(name) LIKE LOWER(?)
        `).all(`%${query}%`);

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
