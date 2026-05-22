const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const productController = require("../controllers/productController");

// ========== FUNCIÓN DE NORMALIZACIÓN DE IDS ==========
function normalizeId(rawId) {
  if (!rawId) return null;
  
  const cleanId = rawId.trim();
  const parsedId = parseInt(cleanId, 10);
  
  if (isNaN(parsedId) || parsedId.toString() !== cleanId) {
    return null; 
  }
  
  return parsedId;
}

// ========== INTERCEPTOR DE PARÁMETROS :id EN EL ROUTER ==========
router.param("id", (req, res, next, idVal) => {
  console.log(`[router.param] Recibido ID: "${idVal}"`);
  
  const idNormalizado = normalizeId(idVal);
  console.log(`[router.param] ID normalizado: ${idNormalizado}`);

  // Escenario 1: ID no numérico o inválido → Error 400
  if (idNormalizado === null) {
    console.log(`[router.param] ID inválido: "${idVal}"`);
    return res.status(400).json({ 
      error: "El ID debe ser un número entero válido.",
      statusCode: 400 
    });
  }

  // Leer productos del JSON
  try {
    const jsonPath = path.join(__dirname, "../datos/products.json");
    console.log(`[router.param] Leyendo JSON desde: ${jsonPath}`);
    
    const archivoData = fs.readFileSync(jsonPath, "utf-8");
    const productosDB = JSON.parse(archivoData);
    
    console.log(`[router.param] Total de productos en DB: ${productosDB.length}`);

    // Buscar el producto con ese ID
    const producto = productosDB.find(p => Number(p.id) === idNormalizado);
    
    console.log(`[router.param] Producto encontrado:`, producto ? `${producto.name} (ID: ${producto.id})` : "NO ENCONTRADO");

    // Escenario 2: ID numérico pero inexistente → Error 404
    if (!producto) {
      console.log(`[router.param] Producto con ID ${idNormalizado} no existe`);
      return res.status(404).json({ 
        error: "El producto no existe en el catálogo.",
        statusCode: 404 
      });
    }

    // Guardar el ID normalizado y el producto en req para usarlos en las rutas
    req.idNormalizado = idNormalizado;
    req.productoEncontrado = producto;
    console.log(`[router.param] Producto asignado a req.productoEncontrado`);
    next();
  } catch (err) {
    console.error(`[router.param] ERROR:`, err.message);
    return res.status(500).json({ 
      error: "Error al leer la base de datos de productos.",
      details: err.message,
      statusCode: 500 
    });
  }
});

// ========== RUTAS ==========
// ORDEN IMPORTANTE: Rutas específicas PRIMERO, luego genéricas

// HOME Y CATEGORÍAS
router.get("/", productController.home);
router.get("/categories/:category", productController.category);

// RUTAS DE CARRITO - ESPECÍFICAS, ANTES DE :id GENÉRICO
router.get("/agregar/:id", (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const productId = req.idNormalizado; // Usa el ID ya normalizado

    const productoEnCarrito = req.session.cart.find(
        item => item.productId === productId
    );

    if (productoEnCarrito) {
        productoEnCarrito.quantity++;
    } else {
        req.session.cart.push({
            productId: productId,
            quantity: 1
        });
    }

    console.log("Carrito después de agregar:", req.session.cart);
    res.redirect('/carrito');
});

router.get("/restar/:id", (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const productId = req.idNormalizado; // Usa el ID ya normalizado

    const productoEnCarrito = req.session.cart.find(
        item => item.productId === productId
    );

    if (productoEnCarrito) {
        productoEnCarrito.quantity--;

        if (productoEnCarrito.quantity <= 0) {
            req.session.cart = req.session.cart.filter(
                item => item.productId !== productId
            );
        }
    }

    res.redirect('/carrito');
});

router.get("/quitar/:id", (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const productId = req.idNormalizado; // Usa el ID ya normalizado

    req.session.cart = req.session.cart.filter(
        item => item.productId !== productId
    );

    res.redirect('/carrito');
});

// RUTAS DE VISTA DE PRODUCTO - ESPECÍFICAS
router.get("/vistProd", productController.vistProd);  // SIN parámetro
router.get("/vistProd/:id", productController.detail);  // CON parámetro

// RUTAS CON :id - ÚLTIMAS (MÁS GENÉRICAS)
router.get("/products/:id", productController.detail);
router.get("/vistProd", productController.detail);

module.exports = router;
