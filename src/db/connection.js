'use strict';

const mysql = require('mysql2/promise');

// Conexiones
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT || '3306', 10),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'crud_microservice',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
});

//Conexion inicial para tests
async function testConnection() {
  const conn = await pool.getConnection();
  console.log('✅  MySQL conectado correctamente');
  conn.release();
}

module.exports = { pool, testConnection };
