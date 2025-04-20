const mongoose = require("mongoose")
const User = require("./user.model")

const calendarSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   event: String,
   date: String,
   time: String,
   description: String
}, {timestamps: false, versionKey: false})

const Calendar = mongoose.model('Calendar', calendarSchema)
module.exports = Calendar