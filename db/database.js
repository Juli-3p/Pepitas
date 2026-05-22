const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('./database.db');

// Carga y ejecuta el schema SQL
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Divide por ; y ejecuta cada statement
schema
  .split(';')
  .filter(statement => statement.trim().length > 0)
  .forEach(statement => {
    db.exec(statement);
  });

console.log('✓ Base de datos inicializada correctamente');

module.exports = db;

