const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const productController = require("../controllers/productController");


function normalizeId(rawId) {

    if (!rawId) return null;

    const cleanId = rawId.trim();
    const parsedId = parseInt(cleanId, 10);

    if (isNaN(parsedId) || parsedId.toString() !== cleanId) {
        return null;
    }
    return parsedId;
}


router.param("id", (req, res, next, idVal) => {
    const idNormalizado = normalizeId(idVal);

    if (idNormalizado === null) {
        return res.status(400).json({
            error: "El ID debe ser un número válido."
        });
    }

    try {

        const jsonPath = path.join(
            __dirname,
            "../datos/products.json"
        );

        const archivoData =
            fs.readFileSync(jsonPath, "utf-8");

        const productosDB =
            JSON.parse(archivoData);

        const producto = productosDB.find(
            p => Number(p.id) === idNormalizado
        );

        // Producto inexistente
        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado."
            });
        }
        req.idNormalizado = idNormalizado;
        req.productoEncontrado = producto;

        next();
    } catch (error) {
        return res.status(500).json({
            error: "Error leyendo productos."
        });
    }
});


router.get("/", productController.home);
router.get("/search", productController.search);
router.get("/categories/:category", productController.category);
router.get("/products/:id", productController.detail);


router.get("/agregar/:id", (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
  
    const productId = req.idNormalizado;

    const productoEnCarrito =
        req.session.cart.find(
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
    res.redirect("/carrito");
});

router.get("/restar/:id", (req, res) => {

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const productId = req.idNormalizado;

    const productoEnCarrito =
        req.session.cart.find(
            item => item.productId === productId
        );

    if (productoEnCarrito) {
        productoEnCarrito.quantity--;

        if (productoEnCarrito.quantity <= 0) {
            req.session.cart =
                req.session.cart.filter(
                    item => item.productId !== productId
                );
        }
    }
    res.redirect("/carrito");
});

router.get("/quitar/:id", (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
  
    const productId = req.idNormalizado;
    req.session.cart =
        req.session.cart.filter(
            item => item.productId !== productId
        );
    res.redirect("/carrito");
});


router.get("/vaciar", (req, res) => {
    req.session.cart = [];
    res.redirect("/carrito");
});

module.exports = router;
