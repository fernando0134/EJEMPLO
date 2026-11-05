const { Category } = require('../models');

// Obtener todas las categorías para llenar el <select> en el frontend
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};

module.exports = {
  getCategories
};