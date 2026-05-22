const productModel = require("../models/productModel");
const productsJSON = require("../datos/products.json");

const productController = {
    home: (req, res) => {
        const suggestedProducts = productModel.getSuggestedProducts();
        const featuredProducts = productModel.getFeaturedProducts();
        res.render("paginas/index", { suggestedProducts, featuredProducts });
    },
    category: (req, res) => {
        const categorySlug = decodeURIComponent(req.params.category || '').trim().toLowerCase();
        const products = productModel.getProductsByCategorySlug(categorySlug);
        const categoryName = products.length > 0
            ? products[0].category
            : categorySlug.replace(/-/g, ' ');
        res.render("paginas/categories", { categoryName, products });
    },
    vistProd: (req, res) => {
        // Si se accede a /vistProd sin parámetro, redirige al home
        console.log(`[productController.vistProd] Accedido a /vistProd sin parámetro`);
        res.redirect("/");
    },
    detail: (req, res) => {
        try {
            // El ID ya está normalizado y validado por app.param("id", ...)
            // Si llega aquí, el ID es válido y el producto existe
            const product = req.productoEncontrado;
            
            console.log(`[productController.detail] Producto recibido:`, product ? `${product.name} (ID: ${product.id})` : "UNDEFINED");
            
            if (!product) {
                console.log(`[productController.detail] ERROR: product es undefined`);
                return res.status(404).render("paginas/404");
            }

            const relatedProducts = productModel.getProductsByCategorySlug(product.category.toLowerCase())
                .filter(p => Number(p.id) !== Number(product.id))
                .slice(0, 4);
            
            console.log(`[productController.detail] Productos relacionados: ${relatedProducts.length}`);
            
            res.render("paginas/vistProd", {
                product, 
                relatedProducts
            });
        } catch (err) {
            console.error(`[productController.detail] ERROR:`, err.message);
            res.status(500).render("paginas/500");
        }
    },
}

module.exports = productController;