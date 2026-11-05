const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('Baja', 'Media', 'Alta'),
    defaultValue: 'Media'
  },
  status: {
    type: DataTypes.ENUM('Abierto', 'En Proceso', 'Resuelto'),
    defaultValue: 'Abierto'
  },
  reportedBy: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'tickets',
  timestamps: true
});

// Relación: Una categoría tiene muchos tickets, y un ticket pertenece a una categoría
Category.hasMany(Ticket, { foreignKey: 'categoryId', as: 'tickets' });
Ticket.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = Ticket;