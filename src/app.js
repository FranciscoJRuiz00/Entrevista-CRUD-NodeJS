'use strict';

const express = require('express');
const cors    = require('cors');

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
  res.json({
    ok: true,
    servicio: 'crud-microservice',
    version: '1.0.0',
  });
});

// Check de health
app.get('/health', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor funciona.' });
});

// Error 404
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: `Ruta '${req.originalUrl}' no encontrada.` });
});

module.exports = app;