const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.get("/", productController.home);
router.get("/categories/:category", productController.category);
router.get("/products/:id", productController.detail);
router.get("/vistProd", productController.vistProd);

module.exports = router;