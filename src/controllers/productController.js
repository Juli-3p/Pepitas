const productsService = require("../services/productsService");
const product = require("../datos/products.json");

const productController = {
    home: (req, res) => {

        const sort = req.query.sort;

        let suggestedProducts =
            productsService.getSuggestedProducts();
        let featuredProducts =
            productsService.getFeaturedProducts();
        let termos =
            productsService.getProductsByCategorySlug("Termos");
        let mates =
            productsService.getProductsByCategorySlug("Mates");
        let yerberas =
            productsService.getProductsByCategorySlug("Yerberas");
        let bombillas =
            productsService.getProductsByCategorySlug("Bombillas");

        if (sort === "asc") {
            suggestedProducts =
                productsService.sortByPriceAsc(suggestedProducts);
            featuredProducts =
                productsService.sortByPriceAsc(featuredProducts);
            termos =
                productsService.sortByPriceAsc(termos);
            mates =
                productsService.sortByPriceAsc(mates);
            yerberas =
                productsService.sortByPriceAsc(yerberas);
            bombillas =
                productsService.sortByPriceAsc(bombillas);
        }

        if (sort === "desc") {
            suggestedProducts =
                productsService.sortByPriceDesc(suggestedProducts);
            featuredProducts =
                productsService.sortByPriceDesc(featuredProducts);
            termos =
                productsService.sortByPriceDesc(termos);
            mates =
                productsService.sortByPriceDesc(mates);
            yerberas =
                productsService.sortByPriceDesc(yerberas);
            bombillas =
                productsService.sortByPriceDesc(bombillas);
        }

        res.render("paginas/index", {
            suggestedProducts,
            featuredProducts,
            termos,
            mates,
            yerberas,
            bombillas,
            sort
        });
    },
    category: (req, res) => {
        const categorySlug = decodeURIComponent(req.params.category || '').trim().toLowerCase();
        const products = productsService.getProductsByCategorySlug(categorySlug);
        const categoryName = products.length > 0
            ? products[0].category
            : categorySlug.replace(/-/g, ' ');
            res.render("paginas/categories", { categoryName, products });
        },

        search: (req, res) => {
            const query = req.query.query;
            const results = productsService.searchProducts(query);
    
            res.render("paginas/searchResults",{query, results});
        },

        detail: (req, res) => {
            const id = req.params.id;
            const product = productsService.getProductById(id);
            
            if (!product) {
                return res.status(404).render("paginas/404");
            }
        const relatedProducts = productsService.getProductsByCategorySlug(product.category.toLowerCase()).filter(p => p.id != product.id).slice(0, 4);
        
        res.render("paginas/vistProd", {
            product, relatedProducts
        });
    },

    sort: (req, res) => {

        const order = req.query.order || "asc";

        const suggestedProducts =
            productsService.getSuggestedProducts()
                .sort((a,b) => order === "asc" ? a.price - b.price : b.price - a.price);

        const featuredProducts =
            productsService.getFeaturedProducts()
                .sort((a,b) => order === "asc" ? a.price - b.price : b.price - a.price);;
    },
}


module.exports = productController;
