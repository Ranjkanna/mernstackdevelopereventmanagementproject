const addSchema = require('../modal/eventaddSchema');

const eventaddController = {
  
  addUser: async (req, res) => {
    try {
      const {
        name,
        event,
        date,
        time,
        endTime,
        location,
        guests,
        status,
        image,
        coords,
        guestCount,
        totalAmount,
        cuisines,
        specialNote,
      } = req.body;

      const newEvent = new addSchema({
        userId:      req.user.id,
        name,
        event:       event || "others",
        date,
        time:        time || "",
        endTime:     endTime || "",
        location,
        coords:      coords && typeof coords.lat === "number" && typeof coords.lng === "number"
                       ? { lat: coords.lat, lng: coords.lng }
                       : undefined,
        guests:      Array.isArray(guests) ? guests : [],
        cuisines:    Array.isArray(cuisines) ? cuisines : [],
        guestCount:  Number(guestCount) || 0,
        totalAmount: Number(totalAmount) || 0,
        specialNote: specialNote || "",
        status:      status || "upcoming",
        image:       image || "",
      });

      await newEvent.save();
      res.status(201).json({ message: "Event created successfully!", event: newEvent });
    } catch (err) {
      res.status(500).json({ message: "Error saving event: " + err.message });
    }
  },

  // GET /api/events (Mapped to getUserData)
  getEvents: async (req, res) => {
    try {
      const events = await addSchema.find({ userId: req.user.id }).sort({ date: 1 });
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: "Error fetching events: " + err.message });
    }
  },

  // GET /api/get-event/:id (Mapped to getUserById)
  getEventById: async (req, res) => {
    try {
      const event = await addSchema.findOne({ _id: req.params.id, userId: req.user.id });
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json({ message: "Error fetching event: " + err.message });
    }
  },

  
  updateEvent: async (req, res) => {
    try {
      const filter = req.user.isAdmin
        ? { _id: req.params.id }
        : { _id: req.params.id, userId: req.user.id };

      const updated = await addSchema.findOneAndUpdate(
        filter,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Event not found" });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating event: " + err.message });
    }
  },

  // DELETE /api/events/:id (Mapped to deleteUser)
  // Same ownership-bypass-for-admins fix as updateEvent above.
  deleteEvent: async (req, res) => {
    try {
      const filter = req.user.isAdmin
        ? { _id: req.params.id }
        : { _id: req.params.id, userId: req.user.id };

      const deleted = await addSchema.findOneAndDelete(filter);
      if (!deleted) return res.status(404).json({ message: "Event not found" });
      res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting event: " + err.message });
    }
  },

  // GET /api/admin/events (admin only — all users' events)
  // FIX: added .populate() so each event's userId comes back as the actual
  // user document (fullName, email, phoneNumber) instead of a bare ObjectId.
  // This is exactly why the admin dashboard was showing "Unknown" / "Phone: —"
  // on every card — b.userId?.fullName had nothing to read from a raw id string.
  getAllEventsAdmin: async (req, res) => {
    try {
      const events = await addSchema
        .find()
        .populate('userId', 'fullName email phoneNumber')
        .sort({ date: 1 });
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: "Error fetching all events: " + err.message });
    }
  },
};

// Export directly under the same names addRoutes.js calls —
// no renaming, so route wiring and controller stay in sync.
module.exports = eventaddController;