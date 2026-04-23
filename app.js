const express = require ('express');

const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/',(req,res) =>{
    res.render("../views/paginas/index");
});

app.listen(port, () =>{
    console.log("Aplicacion funcionando en el puerto");
});