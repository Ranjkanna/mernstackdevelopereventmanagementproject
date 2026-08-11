const mongoose = require('mongoose');
const authregSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // ✅ NEW
    isAdmin: {
      type: Boolean,
      default: false,
    },
  }
)
const authregModel = mongoose.model("Registration", authregSchema);
module.exports = authregModel;