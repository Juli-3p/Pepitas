const express = require ('express');

const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/',(req,res) => res.render("../views/paginas/index")); //inicio

app.get('/logeo',(req,res) => res.render("../views/paginas/logeo")); //login

app.get('/registro',(req,res) => res.render("../views/paginas/registro")); //registro

app.get('/carrito',(req,res) => res.render("../views/paginas/carrito")); //carrito

app.listen(port, () =>{
    console.log("Aplicacion funcionando en el puerto");
});