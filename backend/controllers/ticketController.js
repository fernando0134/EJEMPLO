const { Ticket, Category } = require('../models');

// 1. Listar todos los tickets (con su categoría asociada)
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar tickets', error: error.message });
  }
};

// 2. Obtener un ticket por ID
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el ticket', error: error.message });
  }
};

// 3. Crear un ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, status, reportedBy, categoryId } = req.body;

    if (!title || !description || !reportedBy || !categoryId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const newTicket = await Ticket.create({
      title,
      description,
      priority,
      status,
      reportedBy,
      categoryId
    });

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear ticket', error: error.message });
  }
};

// 4. Actualizar ticket (ej. cambiar estado a "Resuelto")
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    await ticket.update(req.body);
    res.json({ message: 'Ticket actualizado correctamente', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar ticket', error: error.message });
  }
};

// 5. Eliminar un ticket
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }

    await ticket.destroy();
    res.json({ message: 'Ticket eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar ticket', error: error.message });
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
};