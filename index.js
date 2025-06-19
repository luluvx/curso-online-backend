require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public'));


//middleware para habilitar CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
    ]
}));

//middleware para parsear las cookies
app.use(cookieParser());

//middleware para parsear solicitudes con JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para solicitudes URL-encoded

//middleware para validación de errores de JSON
app.use(function(error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).json({
            error: 'Error en el JSON'
        });
    } else {
        next();
    }
});

const db = require('./models');

//sincronización de la base de datos
db.sequelize.sync({
    //force: true // Borra y recrea la base de datos cada vez que se inicia el servidor
}).then(() => {
    console.log('Base de datos sincronizada');
});


require('./routes')(app);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
