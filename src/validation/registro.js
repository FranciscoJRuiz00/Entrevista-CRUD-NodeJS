'use strict';

const validator = require('validator');

// RFC: En este caso se asume el uso de el formato de persona fisica (13 digitos), 3-4 letras + 6 dígitos (fecha en formato: AA/MM/DD) + 3 alfanuméricos (homoclave)
const RFC_FISICA  = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/i;

// Código postal: combinacion de 5 dígitos
const CP_REGEX = /^\d{5}$/;

//Se validan todos los campos para que sean requeridos
function validarRegistro(data) {
  const errores = [];
  const { nombre_completo, rfc, correo, codigo_postal } = data || {};

  //Nombre
  if (!nombre_completo || String(nombre_completo).trim() === '') {
    errores.push('El campo nombre_completo es requerido.');
  }
  //RFC
  if (!rfc || String(rfc).trim() === '') {
    errores.push('El campo rfc es requerido.');
  }
  //Correo
  if (!correo || String(correo).trim() === '') {
    errores.push('El campo correo es requerido.');
  }
  //Codigo Postal
  if (!codigo_postal || String(codigo_postal).trim() === '') {
    errores.push('El campo codigo_postal es requerido.');
  }

  //Validacion de formatos del formulario
  if (rfc && String(rfc).trim() !== '') {
    const rfcClean = String(rfc).trim().toUpperCase();
    if (!RFC_FISICA.test(rfcClean)) {
      errores.push('El RFC no tiene un formato válido (ej: PEGJ850101ABC).');
    }
  }

  if (correo && String(correo).trim() !== '') {
    if (!validator.isEmail(String(correo).trim())) {
      errores.push('El correo electrónico no tiene un formato válido.');
    }
  }

  if (codigo_postal && String(codigo_postal).trim() !== '') {
    if (!CP_REGEX.test(String(codigo_postal).trim())) {
      errores.push('El código postal debe contener exactamente 5 dígitos numéricos.');
    }
  }

  return errores;
}

//Se sanitizan y normaliza los datos
function sanitizarRegistro(data) {
  return {
    nombre_completo: String(data.nombre_completo).trim(),
    rfc:             String(data.rfc).trim().toUpperCase(),
    correo:          String(data.correo).trim().toLowerCase(),
    codigo_postal:   String(data.codigo_postal).trim(),
  };
}

module.exports = { validarRegistro, sanitizarRegistro };
