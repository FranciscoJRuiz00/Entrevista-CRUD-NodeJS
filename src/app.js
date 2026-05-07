'use strict';

const express            = require('express');
const cors               = require('cors');
const registrosRouter    = require('./routes/registro');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

//Logs
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.originalUrl}`);
  next();
});

// Ruta raiz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    servicio: 'crud-microservice',
    version: '1.0.0',
    endpoints: {
      'GET    /registros':        'Listar todos los registros',
      'POST   /registros':        'Crear registro',
      'GET    /registros/:id':    'Obtener un registro',
      'PUT    /registros/:id':    'Actualizar completo de registro',
      'PATCH  /registros/:id':    'Actualizado parcial de registro',
      'DELETE /registros/:id':    'Eliminar registro',
      'GET    /health': 'Health check',
    },
  });
});

app.use('/registros', registrosRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;