const express = require ('express');

const app = express();

const port = 3000;

const user ={
    primerNombre: "Julian",
    apellido: "Santichia",
    isAdmin: true,
};

const tasks =[
    {title:"Aprender JS", description:"Revisar lo aprendido en PdeP"},
    {title:"Aprender HTML", description:"Revisar lo aprendido en DW"},
    {title:"Aprender CSS", description:"Revisar lo aprendido de CSS"},
]

app.set("view engine", "ejs");

app.get('/',(req,res) =>{
    res.render("pages/index",{user, tasks});
});

app.listen(port, () =>{
    console.log("Aplicacion funcionando en el puerto ${port}");
});
