const db = require("../../db/database");

const categoriesService = {

    getAllCategories() {
        return db.prepare(`
            SELECT DISTINCT category
            FROM products
            ORDER BY category
        `).all();
    },

    getCategoryByName(name) {
        return db.prepare(`
            SELECT DISTINCT category
            FROM products
            WHERE LOWER(category) = LOWER(?)
        `).get(name);
    },

    countCategories() {
        return db.prepare(`
            SELECT COUNT(DISTINCT category) AS total
            FROM products
        `).get().total;
    }

};

module.exports = categoriesService;