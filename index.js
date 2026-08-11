const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// const eventRoutes = require('./routes/eventRoutes');
const addRoutes = require('./routes/addRoutes');
const authRoutes = require('./routes/authregRoutes'); // Imported as authRoutes
const loginRoutes = require('./routes/loginRoutes');
const chatRoutes = require("./routes/chatRoutes");
// 

// app.use('/api', eventRoutes);
app.use('/api', addRoutes);
app.use('/api', authRoutes); // ✅ Fixed: Changed from authregRoutes to authRoutes
app.use('/api', loginRoutes);
  app.use("/api", chatRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5001, () => console.log("🚀 Server running on http://localhost:5001"));
  })
  .catch(err => console.log("❌ DB Error:", err));