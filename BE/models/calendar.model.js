const mongoose = require("mongoose")
const User = require("./user.model")

const calendarSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   title: String,
   description: String,
   start: {
      type: Date,
      required: true
   },
   end: {
      type: Date,
      required: true,
      validate: {
         validator: function (value) {
            return this.start < value
         },
         message: "End date must be after start date"
      }
   },
   location: String,
   is_all_day: Boolean
}, { timestamps: false, versionKey: false })

const Calendar = mongoose.model('Calendar', calendarSchema)
module.exports = Calendar