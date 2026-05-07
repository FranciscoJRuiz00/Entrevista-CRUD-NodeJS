'use strict';

//Middleware para el manejo de errores, responde con un json
function errorHandler(err, req, res, next) { 
  console.error('Error:', err);

  // Errores de duplicado MySQL (RFC o correo duplicado)
  if (err.code === 'ER_DUP_ENTRY') {
    const campo = err.message.includes('rfc') ? 'RFC' : 'correo electrónico';
    return res.status(409).json({
      ok: false,
      mensaje: `El ${campo} ya está registrado en el sistema.`,
    });
  }

  // Error genérico
  return res.status(500).json({
    ok: false,
    mensaje: 'Error interno del servidor.',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

//Middleware para rutas inexistentes o inesperadas
function notFound(req, res) {
  res.status(404).json({
    ok: false,
    mensaje: `Ruta '${req.originalUrl}' no encontrada.`,
  });
}

module.exports = { errorHandler, notFound };
