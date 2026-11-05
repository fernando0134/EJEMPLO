const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false // cámbialo a console.log si quieres ver los queries SQL en vivo
});

module.exports = sequelize;