# Sistema-de-Gestion-de-Pedidos

Para correrlo de manera local deben Clonar el Repositorio en sus computadores
Despues de clonar el respositorio y tenerlo en sus PC, lo abrimos el Visual Studio Code
Le damos Ctrl + Ñ para abrir la consola
en esta debemos fijarnos que estemos dentro de la carpeta del proyecto, llamada proyectoP1 
<code>PS C:\Users\juand\Downloads\proyectoP1></code>

 

Despues de todo esto vamos a levantar la base de datos, para ello ejecutaremos el siguiente comando en la consola, dentro de la carpeta de backend 
<code>PS C:\Users\juand\Downloads\proyectoP1> cd backend</code>
Deberia quedar asi
<code>PS C:\Users\juand\Downloads\proyectoP1\backend> </code>
Dentro de esta carpeta vamos a ejecutar el siguiente comando
<code>pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000</code>
