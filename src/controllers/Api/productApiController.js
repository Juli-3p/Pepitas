const productsService = require("../../services/productsService");

const controller = {

    getAll(req, res) {
        const products = productsService.getAllProducts();

        res.status(200).json(products);
    },
    getById(req, res) {

        const product = productsService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.status(200).json(product);
    },
    create(req, res) {
        
        try {
            const newProduct = productsService.createProduct(req.body);
            
            res.status(201).json(newProduct);
        
        } catch (err) {
            console.log(err);
            
            throw err;
        }
    },
    update(req, res) {

        const product = productsService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        const updatedProduct = productsService.updateProduct(req.params.id, req.body);

        res.status(200).json(updatedProduct);
    },
    delete(req, res) {

        const product = productsService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        productsService.deleteProduct(req.params.id);

        res.status(204).send();
    }

};

module.exports = controller;