const fs = require("fs");
const path = require("path");
const db = require("./database");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");

db.exec(schema);

console.log("Base de datos creada");