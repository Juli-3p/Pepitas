const db = require("../../db/database");

const productsService = {
    getAllProducts: () => {
        return db.prepare("SELECT * FROM products").all();
    },
    getSuggestedProducts: () => {
        return db.prepare(`
            SELECT * FROM products
            WHERE stock > 0
            ORDER BY RANDOM()
            LIMIT 5
            `).all();
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
    createProduct(data) {

         const stmt = db.prepare(`
            INSERT INTO products(
            name,
            description,
            price,
            category,
            stock,
            image,
            featured
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(
                data.name,
                data.description,
                data.price,
                data.category,
                data.stock,
                data.image,
                data.featured
            );
            
            return this.getProductById(result.lastInsertRowid);
        },
    updateProduct(id, data){
        const stmt = db.prepare(`
            UPDATE products
            SET
               name = ?,
               description = ?,
               price = ?,
               stock = ?,
               category = ?
            WHERE id = ?
            `);
        stmt.run(
            data.name,
            data.description,
            data.price,
            data.stock,
            data.category,
            id
        );
        return this.getProductById(id);
    },
    deleteProduct(id){
        const stmt = db.prepare(`
            DELETE FROM products
            WHERE id = ?
            `);
        return stmt.run(id);
    },
    countProducts(){
        const stmt = db.prepare(`
            SELECT COUNT(*) AS total
            FROM products
            `);
        return stmt.get().total;
    },
    sortByPriceAsc: (products) => {
        return [...products].sort((a, b) => a.price - b.price);
    },
    sortByPriceDesc: (products) => {
        return [...products].sort((a, b) => b.price - a.price);
    },
};

module.exports = productsService;
