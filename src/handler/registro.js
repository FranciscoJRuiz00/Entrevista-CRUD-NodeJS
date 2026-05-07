'use strict';

const { pool }                          = require('../db/connection');
const { validarRegistro, sanitizarRegistro } = require('../validation/registro');

//Funcion para crear registros
async function crear(req, res, next) {
  try {
    const errores = validarRegistro(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ ok: false, errores });
    }

    const datos = sanitizarRegistro(req.body);

    const [result] = await pool.execute(
      `INSERT INTO registros (nombre_completo, rfc, correo, codigo_postal)
       VALUES (?, ?, ?, ?)`,
      [datos.nombre_completo, datos.rfc, datos.correo, datos.codigo_postal],
    );

    const [rows] = await pool.execute(
      'SELECT * FROM registros WHERE id = ?',
      [result.insertId],
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Registro creado exitosamente.',
      dato: rows[0],
    });
  } catch (err) {
    return next(err);
  }
}

//Get All registros
async function leerTodos(req, res, next) {
  try {

    const limite = Math.min(100, Math.max(1, parseInt(req.query.limite || '10', 10)));
    const offset = (pagina - 1) * limite;

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) AS total FROM registros',
    );

    const [rows] = await pool.query(
      `SELECT * FROM registros ORDER BY created_at DESC LIMIT ${limite} OFFSET ${offset}`,
    );

    return res.status(200).json({
      ok: true,
      total,
      limite,
      datos: rows,
    });
  } catch (err) {
    return next(err);
  }
}

//Get de un registro
async function leerUno(req, res, next) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ ok: false, mensaje: 'El ID debe ser un número entero positivo.' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM registros WHERE id = ?',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, mensaje: `No se encontró el registro con ID ${id}.` });
    }

    return res.status(200).json({ ok: true, dato: rows[0] });
  } catch (err) {
    return next(err);
  }
}

//Funcion para actualizar un registro
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ ok: false, mensaje: 'El ID debe ser un número entero positivo.' });
    }

    // Verificar existencia
    const [existe] = await pool.execute(
      'SELECT id FROM registros WHERE id = ?', [id],
    );
    if (existe.length === 0) {
      return res.status(404).json({ ok: false, mensaje: `No se encontró el registro con ID ${id}.` });
    }

    const errores = validarRegistro(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ ok: false, errores });
    }

    const datos = sanitizarRegistro(req.body);

    await pool.execute(
      `UPDATE registros
       SET nombre_completo = ?, rfc = ?, correo = ?, codigo_postal = ?
       WHERE id = ?`,
      [datos.nombre_completo, datos.rfc, datos.correo, datos.codigo_postal, id],
    );

    const [rows] = await pool.execute(
      'SELECT * FROM registros WHERE id = ?', [id],
    );

    return res.status(200).json({
      ok: true,
      mensaje: 'Registro actualizado exitosamente.',
      dato: rows[0],
    });
  } catch (err) {
    return next(err);
  }
}

//Funcion de patch de un registro
async function actualizarParcial(req, res, next) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ ok: false, mensaje: 'El ID debe ser un número entero positivo.' });
    }

    const [existe] = await pool.execute(
      'SELECT * FROM registros WHERE id = ?', [id],
    );
    if (existe.length === 0) {
      return res.status(404).json({ ok: false, mensaje: `No se encontró el registro con ID ${id}.` });
    }

    // Agarra los datos existentes y reemplaza con los nuevos
    const actual = existe[0];
    const merged = {
      nombre_completo: req.body.nombre_completo ?? actual.nombre_completo,
      rfc:             req.body.rfc             ?? actual.rfc,
      correo:          req.body.correo          ?? actual.correo,
      codigo_postal:   req.body.codigo_postal   ?? actual.codigo_postal,
    };

    const errores = validarRegistro(merged);
    if (errores.length > 0) {
      return res.status(400).json({ ok: false, errores });
    }

    const datos = sanitizarRegistro(merged);

    await pool.execute(
      `UPDATE registros
       SET nombre_completo = ?, rfc = ?, correo = ?, codigo_postal = ?
       WHERE id = ?`,
      [datos.nombre_completo, datos.rfc, datos.correo, datos.codigo_postal, id],
    );

    const [rows] = await pool.execute('SELECT * FROM registros WHERE id = ?', [id]);

    return res.status(200).json({
      ok: true,
      mensaje: 'Registro actualizado parcialmente.',
      dato: rows[0],
    });
  } catch (err) {
    return next(err);
  }
}

// Eliminar un registro
async function eliminar(req, res, next) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ ok: false, mensaje: 'El ID debe ser un número entero positivo.' });
    }

    const [existe] = await pool.execute(
      'SELECT id FROM registros WHERE id = ?', [id],
    );
    if (existe.length === 0) {
      return res.status(404).json({ ok: false, mensaje: `No se encontró el registro con ID ${id}.` });
    }

    await pool.execute('DELETE FROM registros WHERE id = ?', [id]);

    return res.status(200).json({
      ok: true,
      mensaje: `Registro con ID ${id} eliminado exitosamente.`,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { crear, leerTodos, leerUno, actualizar, actualizarParcial, eliminar };
