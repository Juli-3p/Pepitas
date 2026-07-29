const productsService = require("../../services/productsService");
const categoriesService = require("../../services/categoriesService");

const controller = {

    getStats(req, res) {

        res.status(200).json({

            totalProducts: productsService.countProducts(),

            totalCategories: categoriesService.countCategories()

        });

    }

};

module.exports = controller;