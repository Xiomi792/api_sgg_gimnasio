
const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
router.get('/', (req, res) => {
    const sql = 'SELECT id, nombre, correo, rol, fecha_registro FROM usuarios';

    connection.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al consultar los usuarios' });
        }

        res.json(results);
    });
});

// Registrar un usuario
router.post('/', async (req, res) => {
    const { nombre, correo, clave, rol } = req.body;

    try {
        const claveEncriptada = await bcrypt.hash(clave, 10);

        const sql = 'INSERT INTO usuarios (nombre, correo, clave, rol) VALUES (?, ?, ?, ?)';

        connection.query(sql, [nombre, correo, claveEncriptada, rol || 'cliente'], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }

            res.status(201).json({
                mensaje: 'Usuario registrado correctamente',
                id: results.insertId
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al encriptar la clave' });
    }
});

// Obtener un usuario por su ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT id, nombre, correo, rol, fecha_registro FROM usuarios WHERE id = ?';

    connection.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al consultar el usuario' });
        }

        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(results[0]);
    });
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, clave, rol } = req.body;

    try {
        const claveEncriptada = await bcrypt.hash(clave, 10);

        const sql = 'UPDATE usuarios SET nombre = ?, correo = ?, clave = ?, rol = ? WHERE id = ?';

        connection.query(sql, [nombre, correo, claveEncriptada, rol, id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al actualizar el usuario' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            res.json({ mensaje: 'Usuario actualizado correctamente' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al encriptar la clave' });
    }
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM usuarios WHERE id = ?';

    connection.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Usuario eliminado correctamente' });
    });
});

module.exports = router;
