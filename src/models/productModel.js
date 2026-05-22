const products = require("../datos/products.json");

const productModel = {

   getSuggestedProducts() {

      const shuffled = [...products].sort(() => 0.5 - Math.random());

      return shuffled.slice(0, 5);

   },

   getFeaturedProducts() {

      return products
         .filter(product => product.featured)
         .slice(0, 10);

   },

   slugifyCategory(category) {

      if (!category) return '';

      return category
         .trim()
         .toLowerCase()
         .replace(/\s+/g, '-')
         .replace(/[^a-z0-9-]/g, '-')
         .replace(/-+/g, '-')
         .replace(/^-+|-+$/g, '');

   },

   getProductsByCategory(category) {

      if (!category) return [];

      const normalized = category.trim().toLowerCase();

      return products.filter(product =>
         product.category.toLowerCase() === normalized
      );

   },

   getProductsByCategorySlug(categorySlug) {

      if (!categorySlug) return [];

      const normalizedSlug =
         categorySlug.trim().toLowerCase();

      return products.filter(product => {

         const slug =
            this.slugifyCategory(product.category);

         const raw =
            product.category.trim().toLowerCase();

         return slug === normalizedSlug
            || raw === normalizedSlug;

      });

   },

   getProductById(id) {

      return products.find(product =>
         product.id == id
      );

   }

};

module.exports = productModel;