const categoriesService = require("../../services/categoriesService");

const controller = {

    getAll(req, res) {
        const categories = categoriesService.getAllCategories();
        res.status(200).json(categories);
    },

    getByName(req, res) {
        const category = categoriesService.getCategoryByName(req.params.name);

        if (!category) {
            return res.status(404).json({
                error: "Categoría no encontrada"
            });
        }

        res.status(200).json(category);
    }

};

module.exports = controller;