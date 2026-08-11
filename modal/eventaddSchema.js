const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },

    name:     { type: String, required: true },   
    event:    { type: String, default: "others" }, 
    date:     { type: Date,   required: true },    
    time:     { type: String, default: "" },
    endTime:  { type: String, default: "" },

    location: { type: String, default: "" },       


    coords: {
      lat: { type: Number },
      lng: { type: Number },
    },

    guests:   { type: [String], default: [] },     

    
    cuisines: { type: [String], default: [] },

    
    guestCount:  { type: Number, default: 0 },
    specialNote: { type: String, default: "" },
    totalAmount: { type: Number, default: 0 },

    status: { type: String, default: "upcoming" },  
    image:  { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);