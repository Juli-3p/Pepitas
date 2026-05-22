const db = require('./database');

const products = require('../src/datos/products.json');

const insertProduct = db.prepare(`
    INSERT INTO products (
        name,
        description,
        price,
        stock,
        image_url,
        active
    )
    VALUES (?, ?, ?, ?, ?, ?)
`);

products.forEach(product => {

    insertProduct.run(
        product.name,
        product.description,
        product.price,
        product.stock,
        product.image,
        1
    );

});

console.log('✓ Productos insertados');

console.log(
    db.prepare("SELECT * FROM products").all()
);
