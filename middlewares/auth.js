
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authorization = req.headers['authorization'];

    if (!authorization) {
        return res.status(401).json({
            mensaje: 'Debes iniciar sesión'
        });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            mensaje: 'Token no proporcionado correctamente'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        if (error) {
            return res.status(401).json({
                mensaje: 'Token inválido o expirado'
            });
        }

        req.usuario = usuario;
        next();
    });
}

module.exports = verificarToken;
