'use strict';

const { Router } = require('express');
const handler    = require('../handler/registro');

const router = Router();

// Health check de API
router.get('/health', (req, res) => {
  res.status(200).json({ ok: true, mensaje: 'API funcionando correctamente.', timestamp: new Date() });
});

// CRUD de registros
router.post  ('/',         handler.crear);
router.get   ('/',         handler.leerTodos);
router.get   ('/:id',      handler.leerUno);
router.put   ('/:id',      handler.actualizar);
router.patch ('/:id',      handler.actualizarParcial);
router.delete('/:id',      handler.eliminar);

module.exports = router;
