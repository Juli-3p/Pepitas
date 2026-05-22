const productsService = require("./productsService");

const cartService = {
    initializeCart: (session) => {
        if (!session.cart) {
            session.cart = [];
        }
    },
    addProduct: (session, productId) => {
        cartService.initializeCart(session);

        const producto = productsService.getProductById(productId);
        if (!producto) {
            return false;
        }
        const productoEnCarrito = session.cart.find(item => item.productId === productId);

        if (productoEnCarrito) {
            productoEnCarrito.quantity++;
        } else {
            session.cart.push({
                productId,quantity: 1
            });
        }
        return true;
    },
    decreaseProduct: (session, productId) => {

        cartService.initializeCart(session);

        const productoEnCarrito = session.cart.find(item => item.productId === productId);

        if (productoEnCarrito) {
            productoEnCarrito.quantity--;
            if (productoEnCarrito.quantity <= 0) {
                session.cart = session.cart.filter(item => item.productId !== productId);
            }
        }
    },
    removeProduct: (session, productId) => {

        cartService.initializeCart(session);

        session.cart = session.cart.filter(item => item.productId !== productId);
    },
    clearCart: (session) => {
        session.cart = [];
    },
    getCart: (session) => {

        cartService.initializeCart(session);

        return session.cart.map(item => {
            const producto = productsService.getProductById(item.productId);
            return {
                ...producto,
                quantity: item.quantity
            };
        });
    },
    getTotal: (cart) => {

        return cart.reduce((acc, producto) => {

            return acc + (producto.price * producto.quantity);
        }, 0);
    }
};

module.exports = cartService;