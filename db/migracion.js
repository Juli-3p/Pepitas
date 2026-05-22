const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log('Migrando productos..\n');

const db = new Database('./database.db');

try {
  // Leer archivo JSON
  const productsPath = path.join(__dirname, '../src/datos/products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  console.log(`✓ Archivo leído: ${productsData.length} productos encontrados\n`);

  // Extraer categorías únicas
  const categories = [...new Set(productsData.map(p => p.category))];
  console.log(`📂 Categorías detectadas: ${categories.join(', ')}\n`);

  // Insertar categorías
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (name)
    VALUES (?)
  `);

  const transaction = db.transaction(() => {
    console.log('Insertando categorías...');
    categories.forEach(category => {
      insertCategory.run(category);
      console.log(`  ✓ ${category}`);
    });

    // Obtener mapeo de categorías para los productos
    const categoryMap = {};
    categories.forEach(cat => {
      const result = db.prepare(`
        SELECT id FROM categories WHERE name = ?
      `).get(cat);
      categoryMap[cat] = result.id;
    });

    // Insertar productos
    console.log('\nInsertando productos...');
    const insertProduct = db.prepare(`
      INSERT OR IGNORE INTO products 
      (id, name, description, price, category_id, stock, image_url, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    productsData.forEach(product => {
      const categoryId = categoryMap[product.category];
      insertProduct.run(
        product.id,
        product.name,
        product.description,
        product.price,
        categoryId,
        product.stock,
        product.image,
        product.featured ? 1 : 0
      );
      console.log(`  ✓ ${product.name}`);
    });
  });

  // Ejecutar transacción
  transaction();

  // Validar datos importados
  const count = db.prepare('SELECT COUNT(*) as total FROM products').get();
  const categories_count = db.prepare('SELECT COUNT(*) as total FROM categories').get();

  console.log(`\n Migración completada `);
  console.log(`   - Categorías: ${categories_count.total}`);
  console.log(`   - Productos: ${count.total}`);

  db.close();
} catch (error) {
  console.error(' Error en la migración:', error.message);
  db.close();
  process.exit(1);
}
//YA SE PUEDE BORRAR PRODUCTOS.JSON DESDE src/datos/PRODUCTOS.JSON, YA QUE LOS DATOS ESTAN EN LA BASE DE DATOS
//SI QUERES AGREGAR MAS PRODUCTOS, TENES QUE AGREGARLOS A LA BASE DE DATOS, NO AL JSON.