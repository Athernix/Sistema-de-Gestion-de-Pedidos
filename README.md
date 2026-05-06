# Sistema de Gestión de Pedidos

Este proyecto es un sistema integral para la gestión de pedidos de un restaurante de comida rápida, compuesto por un backend en FastAPI, un frontend estático y una base de datos en PostgreSQL.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

  * Python 3.x
  * PostgreSQL / pgAdmin 4
  * Visual Studio Code

## Configuración de la Base de Datos

1.  Abre **pgAdmin 4** y crea una nueva base de datos llamada `restaurante_comida_rapida`.

2.  Selecciona la base de datos recién creada.

3.  Dirígete a la parte superior y abre las **Herramientas de consulta** (o presiona `Alt + Shift + Q`).

4.  Copia y pega el contenido del archivo SQL proporcionado y presiona el botón de **Ejecutar**.

## Instalación y Configuración Local

Sigue estos pasos para poner en marcha el proyecto en tu entorno local:

### 1\. Clonar el Repositorio

Clona el proyecto en tu equipo y abre la carpeta raíz en Visual Studio Code.

### 2\. Configurar el Entorno Virtual (Backend)

Abre una terminal en VS Code (`Ctrl + Ñ`) y asegúrate de estar en la carpeta raíz `proyectoP1`.

```bash
python -m venv run
run\Scripts\Activate
```

*Nota: Si recibes un error de permisos en Windows, ejecuta el siguiente comando y vuelve a intentar la activación:*

```powershell
Set-ExecutionPolicy Unrestricted -Scope CurrentUser
```

Una vez activado el entorno, verás el indicador `(venv)` en tu terminal.

### 3\. Instalación de Dependencias

Con el entorno virtual activo, instala las librerías necesarias:

```bash
pip install -r requirements.txt
pip install fastapi uvicorn sqlalchemy psycopg2-binary
```

### 4\. Conexión con la Base de Datos

Debes configurar tus credenciales locales. Dirígete al archivo `backend > app > repositories > database.py` y modifica la línea de conexión con tu contraseña de pgAdmin4:

## Ejecución del Proyecto

### Iniciar el Backend (FastAPI)

Desde la carpeta `backend`, ejecuta el servidor:

```bash
uvicorn main:app --reload
```

El servidor estará corriendo correctamente cuando visualices un mensaje similar a este:

Puedes verificar el funcionamiento y acceder a la documentación interactiva en:
`http://localhost:8000/docs`

### Iniciar el Frontend

Abre una **segunda terminal** en VS Code, sitúate en la carpeta del frontend y levanta un servidor web local:

```bash
cd frontend
python -m http.server 3000
```

## Acceso al Sistema

Una vez que ambos servidores estén activos, abre el archivo `index.html` en tu navegador o escribe la dirección http://localhost:3000/ para interactuar con el sitio web.

-----
## Arquitectura del Sistema

El proyecto sigue una arquitectura multicapas que garantiza la separación de responsabilidades . El flujo de datos está estructurado de manera unidireccional, desde la interacción del usuario hasta el almacenamiento de los datos, pasando por las siguientes capas:

### Frontend (Cliente)

* **View (Capa de Presentación):** Es la interfaz gráfica que ve el usuario. Se encarga de renderizar el contenido en el navegador y capturar las interacciones (clics, ingresos de texto) del cliente o administrador del restaurante.
* **State (Estado Local):** Responsable de manejar la persistencia de los datos temporales en el entorno local del navegador. Mantiene sincronizada la información que el usuario está manipulando antes de confirmar el pedido.
* **Services(Capa de Comunicación):** Actúa como intermediario entre el cliente y el servidor. Se encarga de realizar las peticiones HTTP al backend y aplicar validaciones básicas antes de emitir la solicitud por la red.

### Backend (Servidor - FastAPI)

* **Routes (Capa de Enrutamiento):** Recibe las peticiones HTTP entrantes del frontend. Define los *endpoints*, valida las estructuras de los datos de entrada y salida y delega la ejecución a la capa de servicios. Mantiene el controlador limpio de reglas de negocio.
* **Services (Lógica de Negocio):** Es el núcleo de la aplicación. Aquí residen todas las reglas, operaciones y validaciones complejas del negocio del restaurante.
* **Repository (Capa de Persistencia):** Abstrae y centraliza la comunicación con el motor de almacenamiento. Ejecuta las consultas a la base de datos a través de SQLAlchemy/psycopg2, aislando a la capa de servicios de la sintaxis y detalles de SQL.

### Almacenamiento

* **Base de Datos (PostgreSQL):** La infraestructura física/lógica donde reside la información de manera persistente. Asegura la integridad relacional de los pedidos, productos y demás entidades del sistema.

## Modelo de Base de Datos

El sistema utiliza PostgreSQL como motor de base de datos relacional. El esquema está diseñado para mantener una clara separación entre el catálogo de productos disponibles y la información transaccional.

![Diagrama de Entidad-Relación](/Documentation/img/ERD.png)

### Descripción de Entidades

El modelo se compone de 4 tablas principales divididas en dos dominios lógicos:

#### 1. Catálogo (Inventario)
Estas tablas almacenan la información estática que se muestra al usuario en la interfaz:
* **`menu`**: Almacena los platillos o artículos individuales. Contiene identificadores, nombres de los platillos, descripción de ingredientes y sus precios unitarios.
* **`combo`**: Almacena las agrupaciones de productos o promociones. Contiene su propio identificador, nombre del combo, descripción y el precio total del combo.

#### 2. Transaccional (Gestión de Órdenes)
Estas tablas registran la actividad de los usuarios y las mesas:
* **`carrito`**: Actúa como el encabezado (header) de la orden. Registra la sesión de compra activa de una mesa (`id_mesa`) y gestiona el ciclo de vida del pedido completo.
* **`pedidos`**: Es la tabla de detalle (line items) que desglosa el contenido de un carrito. Registra qué se pidió, en qué cantidad y las especificaciones para la cocina.

### Relaciones Clave (Foreign Keys)

La tabla **`pedidos`** es el núcleo relacional del sistema. Actúa como una tabla puente o de detalle con las siguientes reglas de negocio aplicadas mediante restricciones (Constraints):

* **Pedidos -> Carrito (N:1):** Un `carrito` puede tener múltiples registros en la tabla `pedidos` (varios ítems en la misma cuenta). La relación se hace a través de la llave foránea `id_carrito`.
* **Pedidos -> Menú / Combo (N:1):** Cada fila en la tabla `pedidos` referencia exactamente a un producto. Para lograr esta flexibilidad, la tabla tiene dos llaves foráneas: `id_menu` y `id_combo`. Dependiendo de lo que el cliente elija, se llenará una u otra para enlazar el pedido con el catálogo correspondiente, dejando la contraria en valor nulo.