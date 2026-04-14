si no funciona bien lo de app.js,usen esto chicos <3


// Importamos la dependencia
const express = require('express');

// Instanciamos nuestra app
const app = express();

// Configuramos la ruta raíz
app.get('/', 
	(req, res) => res.send('¡Alo!')
);

// Iniciamos el servidor
app.listen(3000, 
	()=> console.log("Esta corriendo el server :p! 🫡")
)
