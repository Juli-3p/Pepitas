const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const productos = require('./src/datos/products.json');
const productRoute = require("./src/routes/productRoute");
const authRoute = require("./src/routes/autenticacion");

const app = express();
const port = process.env.PORT || 3000;

// ========== CONFIGURACIÓN INICIAL ==========
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

// ========== FUNCIÓN DE NORMALIZACIÓN DE IDS ==========
function normalizeId(rawId) {
  if (!rawId) return null;
  
  const cleanId = rawId.trim();
  const parsedId = parseInt(cleanId, 10);
  
  if (isNaN(parsedId) || parsedId.toString() !== cleanId) {
    return null; 
  }
  
  return parsedId;
}

// ========== MIDDLEWARE DEL CARRITO ==========
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartCount = (req.session.cart || []).reduce((total, item) => {
        return total + (item.quantity || 1);
    }, 0);

    res.locals.cartCount = cartCount;
    next();
}); //Sesion del carrito


// ========== RUTAS DEL CARRITO ==========
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

app.get('/vaciar-carrito', (req, res) => {
    req.session.cart = [];
    res.redirect('/carrito');
});

// ========== REGISTRO DE RUTAS ==========
// IMPORTANTE: Las rutas con :id se registran DESPUÉS del app.param(),
// así Express ejecuta el interceptor ANTES de la ruta
app.use("/", productRoute);
app.use("/", authRoute);
app.use("/products", productRoute);

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
    res.status(200).render("paginas/checkout");
});

// ========== MANEJADORES DE ERRORES ==========
// 500 - Server Error 
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("paginas/500");
});

// 404 - Not Found (DEBE ESTAR AL FINAL)
app.use((req, res) => {
    res.status(404).render("paginas/404");
});

// ========== INICIAR SERVIDOR ==========
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
