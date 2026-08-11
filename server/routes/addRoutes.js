const express = require('express');
const addRoutes = express.Router();
const eventaddController = require('../controller/eventaddController');
const verifyToken = require('../middleware/authMiddleware');
const adminOnly   = require('../middleware/adminMiddleware'); // ✅ NEW — see below
const User        = require('../modal/authregSchema');

addRoutes.get('/test', (req, res) => {
  res.json({ message: "Backend reachable!" });
});

// ── USER ROUTES ──────────────────────────────────────────────────────────
addRoutes.post('/add-event',    verifyToken, eventaddController.addUser);
addRoutes.get('/events',        verifyToken, eventaddController.getEvents);
addRoutes.get('/events/:id',    verifyToken, eventaddController.getEventById);
addRoutes.put('/events/:id',    verifyToken, eventaddController.updateEvent);
addRoutes.delete('/events/:id', verifyToken, eventaddController.deleteEvent);

// ── ADMIN ROUTES ─────────────────────────────────────────────────────────
addRoutes.get('/admin/events',  verifyToken, adminOnly, eventaddController.getAllEventsAdmin);

addRoutes.get('/admin/users', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

addRoutes.delete('/admin/users/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = addRoutes;