const mongoose = require('mongoose'); 
const User = require("../models/user.model");

module.exports = {
    getAllUser: async (req, res) => {
        try {
            const users = await User.find()
            return res.status(200).json(users)
        } catch (error) {
            console.log("error",error)
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },``

    getUserById: async (req, res) => {
        try {
            const id = req.params.id
            if(!id.trim() || !mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({
                    message: "Id is required"
                })
            }

            const user = await User.findById(id)
            if(!user){
                return res.status(404).json({
                    message: "User not found"
                })
            }

            return res.status(200).json(user)
        } catch (error) {
            console.log("Error",error);
            
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    
}