const express = require('express');
const path = require('path');
const productRoute = require("./src/routes/productRoute");
const authRoute = require("./src/routes/autenticacion");

const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
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

app.get('/carrito',(req,res) => res.render("paginas/carrito")); //carrito

app.get('/pago',(req,res) => res.render("paginas/pago")); //pago

app.get('/vistProd',(req,res) => res.render("paginas/vistProd")); //pago

app.post('/vistProd', (req, res) => {
    res.redirect('/carrito');
});

app.listen(port, () =>{
    console.log("Aplicacion funcionando en el puerto");
});

app.use((req,res) => {
    res.status(404).render("paginas/404");
});