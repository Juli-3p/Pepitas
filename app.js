const express = require('express');
const session = require('express-session');
const path = require('path');
const productos = require('./src/datos/products.json');
const productRoute = require("./src/routes/productRoute");
const authRoute = require("./src/routes/autenticacion");

const app = express();

const port = 5000;

console.log("APP FILE LOADED"); //Check en consola para saber si funciona

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

    next();
}); //Sesion del carrito


app.get('/carrito', (req, res) => {

    console.log("MY CARRITO ROUTE RUNNING"); //Check en consola

    const carritoCompleto = (req.session.cart || []).map(item => {

        const producto = productos.find(
            p => Number(p.id) === item.productId
        );

        return {
            ...producto,
            quantity: item.quantity
        };

    });

    res.render('paginas/carrito', {
        carrito: carritoCompleto
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

app.use("/", productRoute);
app.use("/", authRoute);

app.get('/',(req,res) => res.render("paginas/index")); //inicio

app.post('/', (req, res) => {
    res.redirect('/vistProd');
});

app.get('/logeo',(req,res) => res.render("paginas/logeo")); //login

app.post('/logeo', (req, res) => {
    res.redirect('/');
});

app.get('/registro',(req,res) => res.render("paginas/registro")); //registro


app.get('/pago',(req,res) => res.render("paginas/pago")); //pago

app.get('/vistProd',(req,res) => res.render("paginas/vistProd")); //pago

app.post('/vistProd', (req, res) => {
    res.redirect('/carrito');
});



app.use((req,res) => {
    res.status(404).render("paginas/404");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Aplicacion funcionando en el puerto ${port}`);
});
