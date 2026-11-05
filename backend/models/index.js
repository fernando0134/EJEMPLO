const sequelize = require('../config/database');
const Category = require('./Category');
const Ticket = require('./Ticket');
const User = require('./User');

module.exports = {
  sequelize,
  Category,
  Ticket,
  User
};