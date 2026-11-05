const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, Category } = require('./models');
const categoryRoutes = require('./routes/categoryRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/categories', categoryRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor corriendo correctamente' });
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log(' Conexión a la base de datos establecida con éxito.');

    await sequelize.sync({ alter: true });
    console.log(' Modelos sincronizados con la BD.');

    const total = await Category.count();
    if (total === 0) {
      await Category.bulkCreate([
        { name: 'Hardware', description: 'Problemas físicos con computadoras, teclados, monitores' },
        { name: 'Redes', description: 'Problemas de Wi-Fi, cables de red o switch' },
        { name: 'Software', description: 'Instalación de programas o errores de sistema' },
        { name: 'Cuentas', description: 'Accesos, contraseñas y correos institucionales' }
      ]);
      console.log(' Categorías iniciales creadas con éxito.');
    }

    app.listen(PORT, () => {
      console.log(` Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Error en el servidor:', error);
  }
}

main();