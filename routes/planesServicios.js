
const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// Consultar planes y servicios activos
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM planes_servicios WHERE estado = ?';

    connection.query(sql, ['activo'], (error, resultados) => {
        if (error) {
            console.error('Error al consultar planes y servicios:', error);
            return res.status(500).json({
                mensaje: 'Error al consultar los planes y servicios'
            });
        }

        res.json(resultados);
    });
});

// Registrar un plan o servicio
router.post('/', (req, res) => {
    const { nombre, descripcion, precio, duracion_dias } = req.body;

    if (!nombre || !descripcion || precio == null) {
        return res.status(400).json({
            mensaje: 'El nombre, la descripción y el precio son obligatorios'
        });
    }

    const sql = 'INSERT INTO planes_servicios (nombre, descripcion, precio, duracion_dias) VALUES (?, ?, ?, ?)';

    connection.query(
        sql,
        [nombre, descripcion, precio, duracion_dias || 30],
        (error, resultado) => {
            if (error) {
                console.error('Error al registrar el plan:', error);
                return res.status(500).json({
                    mensaje: 'Error al registrar el plan'
                });
            }

            res.status(201).json({
                mensaje: 'Plan registrado correctamente',
                id: resultado.insertId
            });
        }
    );
});

// Actualizar un plan o servicio
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, precio, duracion_dias, estado } = req.body;

    const sql = 'UPDATE planes_servicios SET nombre = ?, descripcion = ?, precio = ?, duracion_dias = ?, estado = ? WHERE id = ?';

    connection.query(
        sql,
        [nombre, descripcion, precio, duracion_dias, estado, id],
        (error, resultado) => {
            if (error) {
                console.error('Error al actualizar el plan:', error);
                return res.status(500).json({
                    mensaje: 'Error al actualizar el plan'
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Plan no encontrado'
                });
            }

            res.json({
                mensaje: 'Plan actualizado correctamente'
            });
        }
    );
});

// Eliminar un plan o servicio
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM planes_servicios WHERE id = ?';

    connection.query(sql, [id], (error, resultado) => {
        if (error) {
            console.error('Error al eliminar el plan:', error);
            return res.status(500).json({
                mensaje: 'Error al eliminar el plan'
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Plan no encontrado'
            });
        }

        res.json({
            mensaje: 'Plan eliminado correctamente'
        });
    });
});

module.exports = router;
