# 🧠 Guía de Conceptos Clave para la Prueba Técnica
### Proyecto: Sistema de Gestión de Tickets (Full Stack)

Esta guía recopila los conceptos fundamentales, teóricos y prácticos sobre las tecnologías utilizadas en este proyecto (**Vue 3, Node.js, Express, Sequelize, SQLite/PostgreSQL, JWT, Git**) y las preguntas típicas que suelen hacer los reclutadores y líderes técnicos en una entrevista o prueba técnica.

---

## 📌 Tabla de Contenidos
1. [Arquitectura General del Proyecto](#1-arquitectura-general-del-proyecto)
2. [Backend con Node.js & Express](#2-backend-con-nodejs--express)
3. [Autenticación, Seguridad y JWT](#3-autenticación-seguridad-y-jwt)
4. [Bases de Datos y ORM (Sequelize)](#4-bases-de-datos-y-orm-sequelize)
5. [Frontend con Vue 3 & Vuetify](#5-frontend-con-vue-3--vuetify)
6. [Control de Versiones (Git & GitHub)](#6-control-de-versiones-git--github)
7. [Preguntas Frecuentes en Entrevistas Técnicas (Q&A Rápido)](#7-preguntas-frecuentes-en-entrevistas-técnicas-qa-rápido)

---

## 1. Arquitectura General del Proyecto

### ¿Cómo está estructurado este sistema?
Es una arquitectura **Cliente-Servidor desacoplada (Full Stack)**:
* **Frontend (Cliente):** Aplicación SPA (*Single Page Application*) desarrollada con **Vue 3**, **Vite** y **Vuetify** (Material Design). Se encarga de la interfaz de usuario, validaciones visuales y consumo de la API mediante **Axios**.
* **Backend (Servidor):** API REST construida con **Node.js** y **Express**. Gestiona la lógica de negocio, autenticación, autorización y comunicación con la base de datos.
* **Capa de Datos:** **Sequelize** como ORM, configurado para operar con **SQLite** (entorno de pruebas/local) o **PostgreSQL** (entorno de producción).

---

## 2. Backend con Node.js & Express

### 2.1. ¿Cómo funciona la asincronía en Node.js?
* **Event Loop (Bucle de Eventos):** Node.js opera en un solo hilo (*Single Thread*), pero es no bloqueante gracias al Event Loop, que delega operaciones pesadas de Entrada/Salida (I/O, lectura de archivos, consultas a base de datos, peticiones de red) al sistema operativo o a un hilo secundario en segundo plano.
* **`async / await`:** Es azúcar sintáctico sobre las `Promises`. Permite escribir código asíncrono que se lee de forma secuencial, facilitando el manejo de errores mediante bloques `try / catch`.

### 2.2. ¿Qué es un Middleware en Express?
Un middleware es una función que tiene acceso al objeto de petición (`req`), al objeto de respuesta (`res`) y a la siguiente función middleware en el ciclo de solicitud-respuesta (`next`).
* **Usos comunes:**
  * **Parseo de datos:** `express.json()` para transformar el cuerpo en formato JSON.
  * **Seguridad y CORS:** `cors()` para controlar qué dominios pueden consumir la API.
  * **Autenticación:** Validar si una petición incluye un token JWT válido antes de llegar al controlador.
  * **Manejo de errores centralizado:** Capturar excepciones globales.

### 2.3. Métodos HTTP y Códigos de Estado
| Método | Propósito | ¿Idempotente? |
|---|---|---|
| `GET` | Obtener datos o recursos | Sí |
| `POST` | Crear un nuevo recurso | No |
| `PUT` | Reemplazar completamente un recurso existente | Sí |
| `PATCH` | Actualizar parcialmente un recurso | No / Depende |
| `DELETE` | Eliminar un recurso | Sí |

#### Códigos de Estado Clave:
* **200 OK:** Petición exitosa.
* **201 Created:** Recurso creado exitosamente (típico en un `POST`).
* **204 No Content:** Operación exitosa sin cuerpo de respuesta (típico en `DELETE`).
* **400 Bad Request:** Datos inválidos enviados por el cliente.
* **401 Unauthorized:** No autenticado (falta token o es inválido).
* **403 Forbidden:** Autenticado, pero sin permisos para este recurso.
* **404 Not Found:** Recurso o ruta no encontrados.
* **500 Internal Server Error:** Error inesperado en el servidor.

---

## 3. Autenticación, Seguridad y JWT

### 3.1. ¿Qué es un JWT (JSON Web Token) y cómo se compone?
Un JWT es un estándar abierto (RFC 7519) para transmitir información de forma segura y compacta entre las partes como un objeto JSON. Es **stateless** (el servidor no necesita guardar sesiones en memoria).
Se compone de 3 partes separadas por puntos (`Header.Payload.Signature`):
1. **Header:** Tipo de token (`JWT`) y algoritmo de cifrado (`HS256`, `RS256`).
2. **Payload:** Los datos o claims (ej. `id` de usuario, `email`, `role`, expiración `exp`). *Nota: No debe contener información confidencial como contraseñas, ya que solo está codificado en Base64, no encriptado.*
3. **Signature:** Firma generada a partir del Header + Payload + una clave secreta (`JWT_SECRET`). Sirve para verificar que el token no haya sido alterado en el camino.

### 3.2. ¿Por qué se usa `bcrypt` para las contraseñas?
* Las contraseñas nunca deben guardarse en texto plano ni con funciones hash reversibles.
* `bcrypt` es un algoritmo de hashing **unidireccional** que incluye un **Salt** (cadena aleatoria) y un factor de costo configurable (*rounds*), lo que previene ataques de diccionario y de tablas Rainbow.

### 3.3. ¿Qué es CORS y por qué ocurre?
**Cross-Origin Resource Sharing**: Política de seguridad del navegador que bloquea peticiones HTTP realizadas desde un origen (protocolo, dominio o puerto) distinto al del servidor de destino.
* *Solución:* Configurar el middleware `cors` en Express para permitir solicitudes desde el puerto del frontend (ej. `http://localhost:5173` de Vite).

---

## 4. Bases de Datos y ORM (Sequelize)

### 4.1. ¿Qué es un ORM y cuáles son sus ventajas?
Un **ORM (Object-Relational Mapping)** mapea tablas de la base de datos a clases/modelos de JavaScript.
* **Ventajas:**
  * Abstracción de SQL: Permite interactuar con la BD usando métodos JS (`Model.findAll()`, `Model.create()`).
  * Portabilidad: Permite cambiar de SQLite a PostgreSQL modificando únicamente la configuración.
  * Protección nativa contra inyecciones SQL (*SQL Injection*).
* **Desventaja:** Para consultas analíticas masivas o muy complejas, puede ser menos eficiente que SQL puro optimizado.

### 4.2. Relaciones en este proyecto
* **1 a N (Uno a Muchos):**
  * Un **Usuario** puede crear muchos **Tickets** (`User.hasMany(Ticket)` / `Ticket.belongsTo(User)`).
  * Una **Categoría** agrupa múltiples **Tickets** (`Category.hasMany(Ticket)` / `Ticket.belongsTo(Category)`).
* **Integridad referencial:** Uso de llaves foráneas (`userId`, `categoryId`) para mantener la consistencia de los datos.

---

## 5. Frontend con Vue 3 & Vuetify

### 5.1. ¿Qué diferencia a Vue 3 (Composition API vs Options API)?
* **Options API:** Organiza el código por opciones (`data`, `methods`, `computed`, `mounted`). Es intuitiva para componentes pequeños.
* **Composition API (`<script setup>`):** Organiza el código por funcionalidad lógica usando funciones como `ref()`, `reactive()` y hooks del ciclo de vida (`onMounted`). Facilita la reutilización de lógica mediante *Composables*.

### 5.2. Reactividad: `ref` vs `reactive`
* **`ref`:** Para valores primitivos (strings, booleans, numbers) o cualquier tipo. En `<script>` se accede con `.value`, mientras que en el `<template>` se desempaqueta automáticamente.
* **`reactive`:** Solo para objetos o arrays. Mantiene reactividad profunda sin necesidad de usar `.value`.

### 5.3. Propiedades Computadas (`computed`) vs Métodos
* **`computed`:** Se calculan en base a dependencias reactivas y **se guardan en caché**. Solo se recalculan cuando cambia alguna de sus dependencias.
* **Métodos (`methods` / funciones normales):** Se ejecutan cada vez que ocurre un renderizado del componente.

### 5.4. Flujo de Comunicación de Componentes
* **Padre a Hijo:** A través de **Props** (unidireccional).
* **Hijo a Padre:** A través de **Eventos Personalizados (`emit`)**.

---

## 6. Control de Versiones (Git & GitHub)

### 6.1. ¿Por qué es crítico el archivo `.gitignore`?
* Evita subir al repositorio carpetas pesadas como `node_modules` (que se reconstruyen con `npm install`).
* Evita filtrar secretos, credenciales o tokens contenidos en archivos `.env`.
* Previene subir archivos de base de datos local como `database.sqlite`.

### 6.2. Diferencia entre `git merge` y `git rebase`
* **`merge`:** Une dos ramas creando un commit de fusión (*merge commit*). Conserva el historial cronológico exacto.
* **`rebase`:** Reescribe el historial colocando tus commits locales encima de los commits más recientes de la rama remota, dejando un historial lineal y limpio.

---

## 7. Preguntas Frecuentes en Entrevistas Técnicas (Q&A Rápido)

#### P1: ¿Cuál es la diferencia entre autenticación y autorización?
> **Respuesta:** La **autenticación** verifica *quién eres* (ej. validar correo y contraseña al hacer login). La **autorización** verifica *qué permisos tienes* o a qué recursos puedes acceder (ej. saber si un usuario común puede o no eliminar el ticket de otro usuario o crear categorías).

#### P2: ¿Por qué no debemos almacenar el token JWT en el LocalStorage en aplicaciones altamente críticas?
> **Respuesta:** Porque el `localStorage` es accesible mediante JavaScript, lo que lo hace vulnerable a ataques **XSS (Cross-Site Scripting)**. En producción de alta seguridad, la mejor práctica es usar cookies con la bandera **`HttpOnly`**, la cual impide que scripts del navegador lean el token.

#### P3: ¿Qué diferencia hay entre `null` y `undefined` en JavaScript?
> **Respuesta:** `undefined` significa que una variable ha sido declarada pero aún no se le ha asignado un valor (o una función que no retorna nada). `null` es un valor asignado explícitamente para indicar la ausencia intencional de un objeto o valor.

#### P4: ¿Cómo evitarías la inyección SQL en una aplicación?
> **Respuesta:** Utilizando consultas parametrizadas o mediante un ORM como Sequelize, el cual escapa automáticamente las entradas de los usuarios antes de ejecutar la consulta en la base de datos.

#### P5: ¿Qué mejoras le harías a este proyecto antes de llevarlo a producción?
> **Respuesta:**
> 1. Cambiar SQLite por PostgreSQL persistente en la nube.
> 2. Implementar paginación y filtros en la ruta `GET /api/tickets` para no sobrecargar el servidor con miles de registros.
> 3. Agregar validación de esquemas en el backend utilizando librerías como **Joi** o **Zod**.
> 4. Guardar tokens en cookies `HttpOnly` en lugar de `localStorage`.
> 5. Incorporar WebSockets (Socket.io) para actualización de tickets en tiempo real.
