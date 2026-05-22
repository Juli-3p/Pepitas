const express = require("express");
const router = express.Router();

const db = require("../../db/database");

const productController =
    require("../controllers/productController");

function normalizeId(rawId) {
    
    if (!rawId) return null;

    const cleanId = rawId.trim();
    const parsedId =
        parseInt(cleanId, 10);
    if (
        isNaN(parsedId) ||
        parsedId.toString() !== cleanId
    ) {
        return null;
    }
    return parsedId;
}
router.param("id", (req, res, next, idVal) => {

    const idNormalizado = normalizeId(idVal);

    // ERROR 400
    if (idNormalizado === null) {
        return res.status(400).json({error: "El ID debe ser un número válido."});
    }

    const producto = db.prepare(`SELECT * FROM products WHERE id = ?`).get(idNormalizado);

    if (!producto) {
        return res.status(404).json({error: "Producto no encontrado."});
    }
    req.idNormalizado = idNormalizado;
    req.productoEncontrado = producto;
    next();
});

router.get("/", productController.home);
router.get("/search", productController.search);
router.get("/categories/:category", productController.category);
router.get("/products/:id", productController.detail);

router.get("/agregar/:id", (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const productId =
        req.idNormalizado;
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