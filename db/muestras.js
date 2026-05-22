const Database = require('better-sqlite3');

console.log(' Validando datos migrados...\n');

const db = new Database('./database.db');

// Mostrar categorías
const categories = db.prepare('SELECT * FROM categories').all();
console.log(' Categorías:');
categories.forEach(cat => {
  console.log(`  [${cat.id}] ${cat.name}`);
});

// Mostrar productos
const products = db.prepare(`
  SELECT p.id, p.name, c.name as category, p.price, p.stock, p.active
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  ORDER BY p.id
`).all();

console.log(`\nProductos (${products.length} total):`);
products.forEach(prod => {
  const status = prod.active ? '✓' : '✗';
  console.log(`[${prod.id}] ${prod.name}`);
  console.log(`Categoría: ${prod.category || 'Sin categoría'}`);
  console.log(`Precio: $${prod.price} | Stock: ${prod.stock} | Activo: ${status}`);
});

console.log(`\n Total: ${categories.length} categorías, ${products.length} productos\n`);

db.close();
