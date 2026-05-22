const productos = require("../datos/products.json");

const cartService = {
    initializeCart: (session) => {
        if (!session.cart) {
            session.cart = [];
        }
    },

    addProduct: (session, productId) => {
        cartService.initializeCart(session);
        const productoEnCarrito =
            session.cart.find(
                item => item.productId === productId
            );
        if (productoEnCarrito) {
            productoEnCarrito.quantity++;
        } else {
            session.cart.push({
                productId,
                quantity: 1
            });
        }
    },

    decreaseProduct: (session, productId) => {
        cartService.initializeCart(session);
        const productoEnCarrito =
            session.cart.find(
                item => item.productId === productId
            );
        if (productoEnCarrito) {
            productoEnCarrito.quantity--;
            if (productoEnCarrito.quantity <= 0) {
                session.cart =
                    session.cart.filter(
                        item => item.productId !== productId
                    );
            }
        }
    },
    
    removeProduct: (session, productId) => {
        cartService.initializeCart(session);
        session.cart =
            session.cart.filter(
                item => item.productId !== productId
            );
    },
    
    clearCart: (session) => {
        session.cart = [];
    },
    
    getCart: (session) => {
        cartService.initializeCart(session);
        return session.cart.map(item => {
            const producto =
                productos.find(
                    p => Number(p.id) === item.productId
                );
            return {
                ...producto,
                quantity: item.quantity
            };
        });
    },
    
    getTotal: (cart) => {
        return cart.reduce((acc, producto) => {
            return acc + (
                producto.price * producto.quantity
            );
        }, 0);
    }
};

module.exports = cartService;
