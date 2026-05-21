const express = require('express');
const session = require('express-session');
const path = require('path');
const productos = require('./src/datos/products.json');
const productRoute = require("./src/routes/productRoute");
const authRoute = require("./src/routes/autenticacion");

const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: 'pepitas-secret',
    resave: false,
    saveUninitialized: true
})); //Sesiones

app.use((req, res, next) => {

    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Calcular total de items en el carrito
    const cartCount = (req.session.cart || []).reduce((total, item) => {
        return total + (item.quantity || 1);
    }, 0);

    // Pasa el conteo del carrito a todas las vistas
    res.locals.cartCount = cartCount;

    next();
}); //Sesion del carrito


app.get('/carrito', (req, res) => {

    console.log("MY CARRITO ROUTE RUNNING");

    const carritoCompleto = (req.session.cart || []).map(item => {

        const producto = productos.find(
            p => Number(p.id) === item.productId
        );

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

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const productId = parseInt(req.params.id);

    const productoEnCarrito =
        req.session.cart.find(
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

    console.log(req.session.cart);

    res.redirect('/carrito');

});

app.get('/restar/:id', (req, res) => {

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const productId = parseInt(req.params.id);

    const productoEnCarrito =
        req.session.cart.find(
            item => item.productId === productId
        );

    if (productoEnCarrito) {

        productoEnCarrito.quantity--;

        // if quantity reaches 0, remove product
        if (productoEnCarrito.quantity <= 0) {

            req.session.cart = req.session.cart.filter(
                item => item.productId !== productId
            );

        }

    }

    res.redirect('/carrito');

});

app.get('/quitar/:id', (req, res) => {

    if (!req.session.cart) {
        req.session.cart = [];
    }

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

app.use("/", productRoute);
app.use("/", authRoute);

app.post('/', (req, res) => {
    res.redirect('/vistProd');
});

app.get('/logeo',(req,res) => res.render("paginas/logeo")); //login

app.post('/logeo', (req, res) => {
    res.redirect('/');
});

app.get('/registro',(req,res) => res.render("paginas/registro")); //registro


app.get('/pago',(req,res) => res.render("paginas/pago")); //pago

app.post('/vistProd', (req, res) => {
    res.redirect('/carrito');
});


app.get("/checkout", (req, res) => {
  
  res.status(200).render("paginas/checkout");//checkout
});

// 500 - Server Error 
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("paginas/500");
});

// 404 - Not Found
app.use((req, res) => {
    res.status(404).render("paginas/404");
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});


app.listen(port, () =>{
    console.log("Aplicacion meneando la chapa");
});
