const cors = require('cors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const productRoute = require("./src/routes/productRoute");
const authRoute = require("./src/routes/autenticacion");
const expressLayouts = require('express-ejs-layouts');
const db = require("./db/database");
const productsApiRoute = require('./src/routes/Api/productsApiRoute');
const productsService = require("./src/services/productsService");
const statsApiRoute = require('./src/routes/Api/statsApiRoute');
const categoriesApiRoute = require('./src/routes/Api/categoriesApiRoute');

const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/products", productsApiRoute);
app.use("/api/stats", statsApiRoute);
app.use("/api/categories", categoriesApiRoute);

app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(session({
    secret: 'pepitas-secret',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartCount = (req.session.cart || []).reduce((total, item) => {
        return total + (item.quantity || 1);
    }, 0);

    res.locals.cartCount = cartCount;

    next();

});

app.use("/", productRoute);
app.use("/", authRoute);

app.get('/logeo', (req, res) => {
    res.render("paginas/logeo", { layout: false });
});

app.post('/logeo', (req, res) => {
    res.redirect('/');
});

app.get('/registro', (req, res) => {
    res.render("paginas/registro", { layout: false });
});

app.get('/pago', (req, res) => {
    res.render("paginas/pago");
});

app.get("/checkout", (req, res) => {
    res.status(200).render("paginas/checkout");
});

app.get('/carrito', (req, res) => {

    const carritoCompleto = (req.session.cart || []).map(item => {

        const producto = productsService.getProductById(item.productId);

        return {
            ...producto,
            quantity: item.quantity
        };

    });
    const total = carritoCompleto.reduce((acc, producto) => {
        return acc + (producto.price * producto.quantity);
    }, 0);
    res.render('paginas/carrito', {
        carrito: carritoCompleto,
        total: total
    });

});

app.get('/agregar/:id', (req, res) => {

    const productId = parseInt(req.params.id);

    const productoEnCarrito = req.session.cart.find(
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

    res.redirect('/carrito');

});

app.get('/restar/:id', (req, res) => {

    const productId = parseInt(req.params.id);

    const productoEnCarrito = req.session.cart.find(
        item => item.productId === productId
    );

    if (productoEnCarrito) {

        productoEnCarrito.quantity--;

        if (productoEnCarrito.quantity <= 0) {

            req.session.cart = req.session.cart.filter(
                item => item.productId !== productId
            );

        }

    }

    res.redirect('/carrito');

});

app.get('/quitar/:id', (req, res) => {

    const productId = parseInt(req.params.id);

    req.session.cart = req.session.cart.filter(
        item => item.productId !== productId
    );

    res.redirect('/carrito');

});

app.get('/vaciar-carrito', (req, res) => {

    req.session.cart = [];

    res.redirect('/carrito');

});

app.post('/vistProd', (req, res) => {
    res.redirect('/carrito');
});

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).render("paginas/500");

});

app.use((req, res) => {

    res.status(404).render("paginas/404");

});

app.listen(port, () => {

    console.log(`Servidor ejecutándose en http://localhost:${port}`);

});