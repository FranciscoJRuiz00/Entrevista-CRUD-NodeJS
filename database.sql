CREATE DATABASE IF NOT EXISTS crud_microservice
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crud_microservice;

CREATE TABLE IF NOT EXISTS registros (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(255)  NOT NULL,
  rfc           VARCHAR(13)   NOT NULL UNIQUE,
  correo        VARCHAR(255)  NOT NULL UNIQUE,
  codigo_postal VARCHAR(5)    NOT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE INDEX idx_rfc    ON registros(rfc);
CREATE INDEX idx_correo ON registros(correo);


INSERT INTO registros (nombre_completo, rfc, correo, codigo_postal) VALUES
  ('Juan Pérez García',    'PEGJ850101ABC', 'juan.perez@ejemplo.com',  '06600'),
  ('María López Martínez', 'LOMM920315XYZ', 'maria.lopez@ejemplo.com', '44100');
