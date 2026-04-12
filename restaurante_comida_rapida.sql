-- ============================================================
--  BASE DE DATOS: Restaurante Familiar de Comida Rápida
--  VERSIÓN: PostgreSQL (pgAdmin 4)
-- ============================================================

-- IMPORTANTE: Antes de ejecutar esto, asegúrate de haber creado 
-- una base de datos vacía en pgAdmin y de tener el Query Tool abierto en ella.

-- 1. CREACIÓN DEL TIPO ENUM PARA CATEGORÍAS
-- PostgreSQL requiere que los ENUM se creen como un tipo de dato primero
CREATE TYPE categoria_menu AS ENUM (
  'hamburguesa', 'perro_caliente', 'pollo', 'pizza',
  'acompañamiento', 'bebida', 'postre'
);

-- ============================================================
--  TABLA: mesa
-- ============================================================
CREATE TABLE mesa (
  id SERIAL PRIMARY KEY,
  cantidad_personas SMALLINT NOT NULL DEFAULT 4,
  esta_libre BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
--  TABLA: menu (catálogo de productos)
-- ============================================================
CREATE TABLE menu (
  id SERIAL PRIMARY KEY,
  nombre_platillo VARCHAR(100) NOT NULL,
  precio DECIMAL(8,2) NOT NULL,
  descripcion_ingredientes TEXT NOT NULL,
  categoria categoria_menu NOT NULL,
  disponible BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
--  TABLA: combo
-- ============================================================
CREATE TABLE combo (
  id SERIAL PRIMARY KEY,
  nombre_combo VARCHAR(120) NOT NULL,
  id_platillo INT NOT NULL REFERENCES menu(id),
  id_acompanamiento INT NOT NULL REFERENCES menu(id),
  id_bebida INT NOT NULL REFERENCES menu(id),
  precio_combo DECIMAL(8,2) NOT NULL,
  descripcion VARCHAR(255),
  disponible BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
--  TABLA: carrito (pedido activo por mesa)
-- ============================================================
CREATE TABLE carrito (
  id SERIAL PRIMARY KEY,
  id_mesa INT NOT NULL REFERENCES mesa(id),
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  TABLA: pedidos (líneas de detalle del carrito)
-- ============================================================
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  id_carrito INT NOT NULL REFERENCES carrito(id),
  id_menu INT REFERENCES menu(id),
  id_combo INT REFERENCES combo(id),
  cantidad SMALLINT NOT NULL DEFAULT 1,
  subtotal DECIMAL(8,2) NOT NULL,
  notas VARCHAR(200),
  CONSTRAINT chk_item CHECK (
    (id_menu IS NOT NULL AND id_combo IS NULL) OR
    (id_menu IS NULL     AND id_combo IS NOT NULL)
  )
);

-- ============================================================
--  DATOS INICIALES — MESAS
-- ============================================================
INSERT INTO mesa (cantidad_personas, esta_libre) VALUES
  (2,  TRUE), (2,  TRUE), (4,  TRUE), (4,  TRUE), (4,  TRUE),
  (6,  TRUE), (6,  TRUE), (8,  TRUE), (4,  TRUE), (2,  TRUE);

-- ============================================================
--  DATOS INICIALES — MENÚ
-- ============================================================
INSERT INTO menu (nombre_platillo, precio, descripcion_ingredientes, categoria) VALUES
-- Hamburguesas
('Hamburguesa Clásica', 8900, 'Pan brioche tostado, carne de res 120 g, lechuga romana, tomate fresco, cebolla caramelizada, pepinillo, mostaza y kétchup artesanal.', 'hamburguesa'),
('Hamburguesa BBQ', 10500, 'Pan brioche tostado, carne de res 150 g, queso cheddar derretido, tocineta crujiente, anillos de cebolla, salsa barbecue ahumada y lechuga.', 'hamburguesa'),
('Hamburguesa Doble Queso', 11900, 'Pan de sésamo, doble carne de res 100 g c/u, doble queso americano, pepinillo, cebolla blanca, kétchup y mostaza.', 'hamburguesa'),
('Hamburguesa Picante', 10000, 'Pan brioche, carne de res 120 g, queso pepper jack, jalapeños encurtidos, lechuga, tomate, mayonesa sriracha y salsa de ají.', 'hamburguesa'),
('Hamburguesa Hawaiana', 10900, 'Pan tostado, carne de res 120 g, queso suizo, piña a la plancha, tocineta, lechuga, salsa tártara dulce.', 'hamburguesa'),
-- Perros calientes
('Perro Caliente Clásico', 5500, 'Pan suave de hot-dog, salchicha de cerdo tipo Frankfurt 90 g, kétchup, mostaza, mayonesa y papitas trituradas encima.', 'perro_caliente'),
('Perro Caliente Especial', 7200, 'Pan suave, salchicha de res y cerdo 100 g, queso costeño rallado, cebolla caramelizada, tomate picado, mostaza, kétchup, mayonesa y piña en almíbar.', 'perro_caliente'),
('Perro Caliente Ranchero', 7800, 'Pan suave, salchicha ahumada 100 g, pico de gallo, aguacate en cubos, crema de leche, tocineta y cilantro.', 'perro_caliente'),
-- Pollo
('Pechuga Crispy', 9500, 'Pan tipo brioche, filete de pechuga 140 g apanado con panko, lechuga, tomate, cebolla morada y mayonesa de miel-mostaza.', 'pollo'),
('Alitas BBQ (6 unidades)', 9800, 'Alitas de pollo marinadas 24 h en adobo de ajo, pimentón y limón; bañadas en salsa BBQ ahumada, servidas con aderezo ranch.', 'pollo'),
('Wrap de Pollo', 8500, 'Tortilla de harina, tiras de pollo a la plancha 120 g, lechuga morada, tomate cherry, queso parmesano, aderezo César y croutones.', 'pollo'),
-- Pizzas personales
('Pizza Margarita Personal', 9000, 'Base de masa delgada horneada, salsa de tomate San Marzano, queso mozzarella, albahaca fresca y aceite de oliva.', 'pizza'),
('Pizza Pepperoni Personal', 10500, 'Base de masa gruesa, salsa de tomate especiada, queso mozzarella abundante, pepperoni americano y orégano.', 'pizza'),
('Pizza BBQ Pollo Personal', 11000, 'Base de masa delgada, salsa BBQ, queso mozzarella, tiras de pollo a la plancha, cebolla morada y cilantro.', 'pizza'),
-- Acompañamientos
('Papas Fritas Medianas', 4500, 'Papa bastón golden cortada a mano, frita en aceite de girasol, sal marina. Porción 180 g.', 'acompañamiento'),
('Papas Fritas Grandes', 5500, 'Papa bastón golden cortada a mano, frita en aceite de girasol, sal marina. Porción 280 g.', 'acompañamiento'),
('Papas con Queso', 6200, 'Papa bastón grande bañada en salsa de queso cheddar fundido y cebollín picado.', 'acompañamiento'),
('Yuca Frita', 4800, 'Yuca tierna frita en aceite de girasol, sal marina y ají en polvo. Porción 200 g.', 'acompañamiento'),
('Aros de Cebolla', 5000, 'Cebolla blanca apanada en panko, frita hasta dorar. Porción 10 unidades con aderezo ranch.', 'acompañamiento'),
('Nuggets de Pollo (8 u)', 6500, 'Nuggets de pechuga 100 % natural, apanados con especias, fritos y crujientes. Servidos con salsa de tu elección.', 'acompañamiento'),
-- Bebidas
('Gaseosa Mediana', 3000, 'Vaso 400 ml. Opciones: Cola, Cola light, Naranja, Lima-limón o Uva. Con hielo.', 'bebida'),
('Gaseosa Grande', 3800, 'Vaso 600 ml. Opciones: Cola, Cola light, Naranja, Lima-limón o Uva. Con hielo.', 'bebida'),
('Jugo Natural Mediano', 4200, 'Vaso 400 ml de fruta natural procesada al momento. Opciones: mango, maracuyá, fresa, lulo o mora.', 'bebida'),
('Agua Mineral 500 ml', 2500, 'Agua mineral sin gas o con gas 500 ml, marca de la casa.', 'bebida'),
('Malteada de Vainilla', 6500, 'Helado de vainilla 200 g, leche entera 150 ml, batido hasta obtener textura cremosa.', 'bebida'),
('Malteada de Chocolate', 6500, 'Helado de chocolate 200 g, leche entera 150 ml, sirope de cacao, batido cremoso.', 'bebida'),
-- Postres
('Helado Soft (cono/vaso)', 3500, 'Helado soft de vainilla o chocolate en cono wafer o vaso. Tamaño estándar.', 'postre'),
('Brownie con Helado', 6800, 'Brownie tibio de chocolate negro 80 g, bola de helado de vainilla y sirope de caramelo.', 'postre');

-- ============================================================
--  DATOS INICIALES — COMBOS
-- ============================================================
INSERT INTO combo (nombre_combo, id_platillo, id_acompanamiento, id_bebida, precio_combo, descripcion) VALUES
('Combo Clásico', 1, 15, 21, 14900, 'Hamburguesa Clásica + papas medianas + gaseosa mediana. Ahorra $1.500 vs precio individual.'),
('Combo BBQ', 2, 15, 21, 16500, 'Hamburguesa BBQ + papas medianas + gaseosa mediana. Ahorra $2.000 vs precio individual.'),
('Combo Doble Queso', 3, 16, 22, 18900, 'Hamburguesa Doble Queso + papas grandes + gaseosa grande. Combo de alto rendimiento.'),
('Combo Picante', 4, 15, 21, 15900, 'Hamburguesa Picante + papas medianas + gaseosa mediana. Para los amantes del ají.'),
('Combo Hawaiano', 5, 18, 21, 16500, 'Hamburguesa Hawaiana + yuca frita + gaseosa mediana.'),
('Combo Perro Clásico', 6, 15, 21, 11900, 'Perro Caliente Clásico + papas medianas + gaseosa mediana. El favorito familiar.'),
('Combo Perro Especial', 7, 15, 21, 14500, 'Perro Caliente Especial + papas medianas + gaseosa mediana.'),
('Combo Perro Ranchero', 8, 18, 21, 15500, 'Perro Caliente Ranchero + yuca frita + gaseosa mediana.'),
('Combo Crispy', 9, 15, 21, 15900, 'Pechuga Crispy + papas medianas + gaseosa mediana.'),
('Combo Alitas', 10, 19, 21, 16800, 'Alitas BBQ (6 u) + aros de cebolla + gaseosa mediana. Perfecto para compartir.'),
('Combo Wrap', 11, 15, 23, 15900, 'Wrap de Pollo + papas medianas + jugo natural. Opción más liviana.'),
('Combo Pizza Margarita', 12, 20, 21, 17900, 'Pizza Margarita personal + nuggets de pollo (8 u) + gaseosa mediana.'),
('Combo Pizza Pepperoni', 13, 20, 21, 18500, 'Pizza Pepperoni personal + nuggets de pollo (8 u) + gaseosa mediana.'),
('Combo Pizza BBQ Pollo', 14, 20, 22, 19500, 'Pizza BBQ Pollo personal + nuggets de pollo (8 u) + gaseosa grande.');

-- ============================================================
--  DATOS DE EJEMPLO — CARRITO Y PEDIDO ACTIVO
-- ============================================================
INSERT INTO carrito (id_mesa) VALUES (3);

INSERT INTO pedidos (id_carrito, id_menu, id_combo, cantidad, subtotal, notas) VALUES
  (1, NULL,  1, 2, 29800, 'Uno sin pepinillo'),
  (1, NULL,  7, 1, 14500, NULL),
  (1, 27,   NULL, 3, 10500, NULL);

-- ============================================================
--  VISTAS ÚTILES (Adaptadas a PostgreSQL)
-- ============================================================
CREATE OR REPLACE VIEW vista_menu AS
SELECT
  m.id,
  m.categoria,
  m.nombre_platillo,
  '$' || TO_CHAR(m.precio, 'FM99G999') AS precio_formateado,
  m.descripcion_ingredientes,
  CASE WHEN m.disponible THEN 'Sí' ELSE 'No' END AS disponible
FROM menu m
ORDER BY m.categoria, m.precio;

CREATE OR REPLACE VIEW vista_combos AS
SELECT
  c.id,
  c.nombre_combo,
  p.nombre_platillo AS platillo,
  ac.nombre_platillo AS acompanamiento,
  b.nombre_platillo AS bebida,
  '$' || TO_CHAR(c.precio_combo, 'FM99G999') AS precio_combo,
  c.descripcion
FROM combo c
JOIN menu p  ON p.id  = c.id_platillo
JOIN menu ac ON ac.id = c.id_acompanamiento
JOIN menu b  ON b.id  = c.id_bebida
WHERE c.disponible = TRUE
ORDER BY c.precio_combo;

CREATE OR REPLACE VIEW vista_mesas AS
SELECT
  m.id AS mesa,
  m.cantidad_personas,
  CASE WHEN m.esta_libre THEN 'Libre' ELSE 'Ocupada' END AS estado,
  c.id AS carrito_activo
FROM mesa m
LEFT JOIN carrito c ON c.id_mesa = m.id
ORDER BY m.id;

-- ============================================================
--  PROCEDIMIENTOS ALMACENADOS (PL/pgSQL)
-- ============================================================

-- Abrir un carrito para una mesa
CREATE OR REPLACE PROCEDURE abrir_carrito(p_id_mesa INT, INOUT p_id_carrito INT DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE mesa SET esta_libre = FALSE WHERE id = p_id_mesa;
  -- En PostgreSQL se usa RETURNING para capturar el ID recién insertado
  INSERT INTO carrito (id_mesa) VALUES (p_id_mesa) RETURNING id INTO p_id_carrito;
END;
$$;

-- Agregar ítem al carrito (ítem de menú individual)
CREATE OR REPLACE PROCEDURE agregar_menu(
  p_id_carrito INT,
  p_id_menu    INT,
  p_cantidad   SMALLINT,
  p_notas      VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE 
  v_precio DECIMAL(8,2);
BEGIN
  SELECT precio INTO v_precio FROM menu WHERE id = p_id_menu;
  
  INSERT INTO pedidos (id_carrito, id_menu, cantidad, subtotal, notas)
  VALUES (p_id_carrito, p_id_menu, p_cantidad, v_precio * p_cantidad, p_notas);
END;
$$;

-- Agregar combo al carrito
CREATE OR REPLACE PROCEDURE agregar_combo(
  p_id_carrito INT,
  p_id_combo   INT,
  p_cantidad   SMALLINT,
  p_notas      VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE 
  v_precio DECIMAL(8,2);
BEGIN
  SELECT precio_combo INTO v_precio FROM combo WHERE id = p_id_combo;
  
  INSERT INTO pedidos (id_carrito, id_combo, cantidad, subtotal, notas)
  VALUES (p_id_carrito, p_id_combo, p_cantidad, v_precio * p_cantidad, p_notas);
END;
$$;

-- Cerrar mesa
CREATE OR REPLACE PROCEDURE cerrar_mesa(p_id_mesa INT)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE mesa SET esta_libre = TRUE WHERE id = p_id_mesa;
END;
$$;