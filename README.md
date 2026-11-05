# Sistema de Gestión de Tickets (TI) - Práctica Técnica

Aplicación Full Stack para la gestión de incidencias y soporte técnico de TI, implementada con arquitectura desacoplada (Frontend SPA y Backend REST API).

## 🚀 Tecnologías Utilizadas

* **Frontend:** Vue 3, Vite, Vuetify (Material Design), Axios, TypeScript.
* **Backend:** Node.js, Express, Sequelize ORM, SQLite / PostgreSQL, JWT, Bcrypt.
* **Control de versiones:** Git y GitHub.

---

## 📚 Material de Estudio para la Prueba Técnica

Para preparar entrevistas técnicas y justificar la arquitectura y decisiones de este proyecto, consulta:
👉 **[Guía de Conceptos Clave para la Prueba Técnica](CONCEPTOS_PRUEBA_TECNICA.md)**

Incluye:
* Explicación de la arquitectura Cliente-Servidor.
* Conceptos de Node.js, Event Loop, Middlewares y Códigos HTTP.
* Autenticación con JWT, hashing con Bcrypt y CORS.
* Modelado de datos y relaciones con Sequelize.
* Reactividad y ciclo de vida en Vue 3 (Composition API vs Options API).
* Buenas prácticas en Git y preguntas frecuentes de entrevistas.

---

## 🛠️ Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/fernando0134/EJEMPLO.git
cd EJEMPLO
```

### 2. Backend
```bash
cd backend
npm install
# Configura las variables de entorno basadas en .env.example
node server.js # o npm run dev
```

### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev
```
