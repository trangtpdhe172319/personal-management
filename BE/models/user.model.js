const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    fullName: String,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dob: { type: Date }
}, { timestamps: false, versionKey: false })

const User = mongoose.model('User', userSchema)
module.exports = User