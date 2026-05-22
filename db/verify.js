// podes ejecutar esto con -> node db/verify.js

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log(' chusmeando base de datos..\n');

const db = new Database('./database.db');

// Cargar y ejecutar el schema SQL
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

schema
  .split(';')
  .filter(statement => statement.trim().length > 0)
  .forEach(statement => {
    db.exec(statement);
  });

// Obtener todas las tablas
const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' 
  ORDER BY name
`).all();

console.log('📊 Tablas creadas:');
tables.forEach(table => {
  const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
  console.log(`\n  ✓ ${table.name}`);
  columns.forEach(col => {
    console.log(`    - ${col.name}: ${col.type}${col.notnull ? ' (NOT NULL)' : ''}${col.pk ? ' [PK]' : ''}`);
  });
});

// Contar índices
const indexes = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='index' AND tbl_name NOT LIKE 'sqlite_%'
  ORDER BY name
`).all();

console.log('\n📇 Índices creados:');
indexes.forEach(idx => {
  console.log(`  ✓ ${idx.name}`);
});

console.log('\n✅ Verificación completada\n');
db.close();
