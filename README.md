# Sistema-de-Gestion-de-Pedidos
Para correrlo de manera local deben Clonar el Repositorio en sus computadores
Despues de clonar el respositorio y tenerlo en sus PC, lo abrimos el Visual Studio Code
Le damos Ctrl + Ñ para abrir la consola
en esta debemos fijarnos que estemos dentro de la carpeta del proyecto, llamada proyectoP1 
<code>PS C:\Users\juand\Downloads\proyectoP1></code>

Entramos a la carpera del Backend para descargar todas nuestras dependencias: 
<code>PS C:\Users\juand\Downloads\proyectoP1> cd backend</code>
Corremos el siguiente comando 
<code>pip install -r requirements.txt</code>
Asi todas las dependencias quedan instaladas
 

Despues de todo esto vamos a Iniciar el Backend (FastAPI), para ello ejecutaremos el siguiente comando en la consola, dentro de la carpeta de backend 
<code>PS C:\Users\juand\Downloads\proyectoP1> cd backend</code>
Deberia quedar asi
<code>PS C:\Users\juand\Downloads\proyectoP1\backend> </code>
Dentro de esta carpeta vamos a ejecutar el siguiente comando
<code>pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000</code>
Asi ya tendriamos el Backend funcionando y lo podemos probar poniendo esto en nuestro navegador <code>http://localhost:8000/docs</code>.

Despues de inciar el Backend vamos a iniciar el frontend, para ello abrimos otra terminal en nuestra carpeta raiz. 
<code>PS C:\Users\juand\Downloads\proyectoP1></code>
y entramos a nuestra carpeta del Frontend 
<code>PS C:\Users\juand\Downloads\proyectoP1> cd frontend</code>
y alli ejecumaos el siguiente comando 
<code>python -m http.server 3000</code>
Asi tendriamos el frontend ya inicializado

Ahora vamos a crear la base de datos, para ello dentro del pgAdmin 4 de PostgreSQL, creamos una base de datos llamada "restaurante_comida_rapida", alli le damos click o seleccionamos la base de datos
<img width="453" height="275" alt="image" src="https://github.com/user-attachments/assets/5a6debe2-2de5-43a2-96dc-46171b62a663" />
Al tenerlo hay seleccioanado vamos a la aprte superior y le damos click en el boton que dice "Herramientas de consulta" o al Alt + Shift + Q, se abrira una vista vacia, alli copiaremos la base de datos

Despues de ello le damos en Ejecutar 
<img width="85" height="46" alt="image" src="https://github.com/user-attachments/assets/dcbe901e-421c-4501-a55f-91262beec525" />
Asi la base de datos ya quedo creada en PostgreSQL
Pero como vamos a ejecutar el proyecto de manera local, en la capeta de "Backend > core > database.py" debemos cambiar la siguiente linea, solo lo que esta dentro de las comillas. 
<img width="877" height="35" alt="image" src="https://github.com/user-attachments/assets/e3c096a8-712c-4c7d-b7d5-16c0870a7253" />

Solo cambiaremos la contraseña por la que nosotros tenemos asignada en pgAdmin4
[Uploading restaurante_comida_rapida.sql…]()

En Visual Studio Code vamos a hacer lo siguiente para que la conexion con la base de datos sea exitosa
Para ello primero vamos a iniciar nuestro entorno virtual.

Entramos a la carpeta del Backend. En la terminal ejecutamos el siguiente comando
<code>.\venv\Scripts\activate</code>
Si no se ejecuta por permisos ejecutamos el siguiente comando para dar los permisios necesarios a Windows 
<code>Set-ExecutionPolicy Unrestricted -Scope CurrentUser</code>
y luego volvemos a inicializar el entrono virtual, para saver si esta iniicalizado nos debe salir un (venv) en la terminal. 
<code>(venv) PS C:\Users\juand\Downloads\proyectoP1> </code>

Asi tendiramos el entorno virtual incializado, insatalamos librerias necesarias para la conexion con la abse de datos, para ello ejecutamos el siguiente conmando. 
<code>pip install fastapi uvicorn sqlalchemy psycopg2-binary</code>

Luego ejecutamos el servidor, para ello vamos entramos a la carpeta del Backend
<code>PS C:\Users\juand\Downloads\proyectoP1> cd backend</code>

y alli ejecutamos el siguiente comando
<code>uvicorn main:app --reload</code>
Nos deberia quedar de la siguiente manera 
<img width="1018" height="161" alt="image" src="https://github.com/user-attachments/assets/ceb4645d-735b-4283-a77a-69a6bae64e00" />
Asi el servidor estaria corriendo correctamente. 

Luego de ello ya podemos abrir uestro Index.html en el navegador y mirar si esta funcionando el Sitio Web. 






