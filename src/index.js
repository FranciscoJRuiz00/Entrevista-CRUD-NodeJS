'use strict';

require('dotenv').config();

const app                = require('./app');
const { testConnection } = require('./db/connection');
const PORT               = process.env.PORT || 3000;

(async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('La conexion a la base de datos fallo, error:', err.message);
    process.exit(1);
  }
})();