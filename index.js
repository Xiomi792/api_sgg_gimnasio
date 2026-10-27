
const express = require('express');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const verificarToken = require('./middlewares/auth');
const authRoutes = require('./routes/auth');
const planesServiciosRoutes = require('./routes/planesServicios');

const app = express();

app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);
app.use('/planes-servicios', planesServiciosRoutes);

//Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido al Sistema de Gestión para Gimnasio');
});

//Ruta protegida 
app.get('/perfil', verificarToken, (req, res) => {
    res.json({
        mensaje: 'Acceso autorizado',
        usuario: req.usuario
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor funcionando en el puerto 3000');
});
