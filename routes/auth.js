
const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Iniciar sesión
router.post('/login', (req, res) => {
    const { correo, clave } = req.body;

    if (!correo || !clave) {
        return res.status(400).json({
            mensaje: 'El correo y la contraseña son obligatorios'
        });
    }

    const sql = 'SELECT * FROM usuarios WHERE correo = ?';

    connection.query(sql, [correo], async (error, resultados) => {
        if (error) {
            console.error('Error al buscar usuario:', error);
            return res.status(500).json({
                mensaje: 'Error al iniciar sesión'
            });
        }

        if (resultados.length === 0) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const usuario = resultados[0];

        const claveValida = await bcrypt.compare(
            clave,
            usuario.clave
        );

        if (!claveValida) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token: token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });
    });
});

module.exports = router;
