const mongoose = require('mongoose');
const loginSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    isAdmin: {
      type: Boolean,
      default: false,
    },
  }
)
const logModel = mongoose.model('registrations', loginSchema);
module.exports = logModel;