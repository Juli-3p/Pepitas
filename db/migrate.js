const db = require("./database");
const products = require("../src/datos/products.json");

const insert = db.prepare(`
    INSERT OR IGNORE INTO products
    (id, name, price, category, image, stock, description, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
for (const product of products) {
    insert.run(
        product.id,
        product.name,
        product.price,
        product.category,
        product.image,
        product.stock || 0,
        product.description,
        product.featured ? 1 : 0
    );
}

console.log("Productos migrados");