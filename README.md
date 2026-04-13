Aquí tienes una propuesta para el archivo `README.md` de tu repositorio. He organizado la información de manera lógica, con una estética profesional, bloques de código claros y respetando todos los enlaces e instrucciones que proporcionaste.

-----

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

Debes configurar tus credenciales locales. Dirígete al archivo `backend > core > database.py` y modifica la línea de conexión con tu contraseña de pgAdmin4:

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

Una vez que ambos servidores estén activos, abre el archivo `index.html` en tu navegador para interactuar con el sitio web.

-----
