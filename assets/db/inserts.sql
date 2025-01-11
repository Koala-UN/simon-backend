-- Inserts for pais
INSERT INTO mydb.pais (nombre) VALUES ('Colombia');

-- Inserts for departamento
INSERT INTO mydb.departamento (pais_id, nombre) VALUES (1, 'Cundinamarca');
INSERT INTO mydb.departamento (pais_id, nombre) VALUES (1, 'Norte de Santander');
INSERT INTO mydb.departamento (pais_id, nombre) VALUES (1, 'Tolima');

-- Inserts for ciudad
INSERT INTO mydb.ciudad (departamento_id, nombre) VALUES (1, 'Bogotá');
INSERT INTO mydb.ciudad (departamento_id, nombre) VALUES (2, 'Cúcuta');
INSERT INTO mydb.ciudad (departamento_id, nombre) VALUES (3, 'Ibagué');

-- Inserts for direccion
INSERT INTO mydb.direccion (ciudad_id, direccion) VALUES (1, 'Calle 123 #45-67');
INSERT INTO mydb.direccion (ciudad_id, direccion) VALUES (2, 'Avenida 89 #12-34');
INSERT INTO mydb.direccion (ciudad_id, direccion) VALUES (3, 'Carrera 56 #78-90');

-- Inserts for restaurante
INSERT INTO `mydb`.`restaurante` 
(`nombre`, `correo`, `telefono`, `estado`, `id_atenticacion`, `id_transaccional`, `capacidad_reservas`, `direccion_id`, `descripcion`, `categoria`) 
VALUES 
('Restaurante Bogotá', 'bogota@restaurante.com', '1234567890', 'ACTIVO', 'auth123', 'trans123', 50, 1, 'Restaurante especializado en comida típica colombiana', 'Cocina Regional'),
('Restaurante Cúcuta', 'cucuta@restaurante.com', '0987654321', 'ACTIVO', 'auth456', 'trans456', 30, 2, 'Comida rápida con un toque gourmet', 'Comida Rápida'),
('Restaurante Ibagué', 'ibague@restaurante.com', '1122334455', 'ACTIVO', 'auth789', 'trans789', 40, 3, 'Cafetería acogedora con especialidades de postres', 'Cafetería');

-- Inserts for mesa
INSERT INTO mydb.mesa (etiqueta, capacidad, restaurante_id) VALUES ('Mesa 1', 4, 1);
INSERT INTO mydb.mesa (etiqueta, capacidad, restaurante_id) VALUES ('Mesa 1', 4, 2);
INSERT INTO mydb.mesa (etiqueta, capacidad, restaurante_id) VALUES ('Mesa 1', 4, 3);

-- Inserts for reservas
INSERT INTO mydb.reservas (fecha, hora, cantidad, estado, restaurante_id, nombre, telefono, correo, cedula) VALUES ('2024-12-26', '19:00:00', 4, 'PENDIENTE', 1, 'Juan Pérez', '1234567890', 'juan.perez@example.com', '123456789');
INSERT INTO mydb.reservas (fecha, hora, cantidad, estado, restaurante_id, nombre, telefono, correo, cedula) VALUES ('2024-12-26', '20:00:00', 2, 'PENDIENTE', 2, 'María Gómez', '0987654321', 'maria.gomez@example.com', '987654321');
INSERT INTO mydb.reservas (fecha, hora, cantidad, estado, restaurante_id, nombre, telefono, correo, cedula) VALUES ('2024-12-26', '21:00:00', 3, 'PENDIENTE', 3, 'Carlos López', '1122334455', 'carlos.lopez@example.com', '112233445');

-- Inserts for pedido
INSERT INTO mydb.pedido (fecha, hora, id_transaccional, mesa_id) VALUES ('2024-12-26', '19:30:00', 'trans123', 1);
INSERT INTO mydb.pedido (fecha, hora, id_transaccional, mesa_id) VALUES ('2024-12-26', '20:30:00', 'trans456', 2);
INSERT INTO mydb.pedido (fecha, hora, id_transaccional, mesa_id) VALUES ('2024-12-26', '21:30:00', 'trans789', 3);

-- Inserts for platillo
INSERT INTO `mydb`.`platillo` 
(`nombre`, `descripcion`, `precio`, `existencias`, `restaurante_id`, `categoria`) 
VALUES 
('Ajiaco Santafereño', 'Sopa tradicional de la región andina con pollo, papas y guascas', 25000.00, 20, 1, 'Sopas y Cremas'),
('Hamburguesa Gourmet', 'Hamburguesa de carne angus con queso cheddar y cebolla caramelizada', 18000.00, 50, 2, 'Sándwiches y Hamburguesas'),
('Cheesecake de Maracuyá', 'Postre frío con una base de galleta y topping de maracuyá', 12000.00, 15, 3, 'Postres');

-- Inserts for platillo_has_pedido
INSERT INTO mydb.platillo_has_pedido (platillo_id, pedido_id, cantidad, estado, total) VALUES (1, 1, 2, 'PENDIENTE', 30000.00);
INSERT INTO mydb.platillo_has_pedido (platillo_id, pedido_id, cantidad, estado, total) VALUES (2, 2, 1, 'PENDIENTE', 12000.00);
INSERT INTO mydb.platillo_has_pedido (platillo_id, pedido_id, cantidad, estado, total) VALUES (3, 3, 3, 'PENDIENTE', 54000.00);

-- Inserts for mesa_has_reservas
INSERT INTO mydb.mesa_has_reservas (mesa_id, reservas_id) VALUES (1, 1);
INSERT INTO mydb.mesa_has_reservas (mesa_id, reservas_id) VALUES (2, 2);
INSERT INTO mydb.mesa_has_reservas (mesa_id, reservas_id) VALUES (3, 3);