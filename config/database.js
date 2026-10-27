
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sgg_gimnasio'
});

connection.connect((error) => {
    if (error) {
        console.error('Error al conectar con MySQL:', error.message);
        return;
    }

    console.log('Conexión a MySQL exitosa');
});

module.exports = connection;
