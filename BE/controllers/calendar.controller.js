const mongoose = require('mongoose');
const Calendar = require("../models/calendar.model");
const User = require("../models/user.model")

module.exports = {
    showAllCalendar: async (req, res) => {
        try {
            const calendar = await Calendar.find()
            if (!calendar || calendar.length === 0) {
                return res.status(404).json({
                    message: "Calendar not found"
                })
            };

            return res.status(200).json(calendar)
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    showDetailCalendar: async (req, res) => {
        try {
            const calendarId = req.params.id

            if (!calendarId.trim()) {
                return res.status(400).json({ error: "CalendarID does not empty" })
            }

            if (!mongoose.Types.ObjectId.isValid(calendarId)) {
                return res.status(400).json({ error: "CalendarID is not in the correct format." })
            }

            if (!Calendar.findById(calendarId)) {
                return res.status(404).json({ error: "CalendarID does not exists" })
            }

            const calendarInfo = await Calendar.findById(calendarId)

            return res.status(200).json(calendarInfo)
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    addCalendar: async (req, res) => {
        try {
            const { title, description, start, end, location, is_all_day } = req.body

            //Kiểm tra body rỗng
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: "Body cannot be empty. Please provide calendar details." });
            }


            // Validate: Kiểm tra required
            if (!title.trim() || !description.trim() || !start.trim()
                || !end.trim() || !location.trim() || typeof is_all_day === 'undefined') {
                return res.status(400).json({
                    message: "Missing required fields: userId, title, description, start, end, location, is_all_day"
                });
            }

            //Validate
            // Kiểm tra Object
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: "Invalid userId format" });
            }

            //Kiểm tra userId có tồn tại?
            if (!User.findById(userId)) {
                return res.status(400).json({ error: "UserId does not exist" });
            }

            //Validate: start và end là ngày hợp lệ
            const startDate = new Date(start)
            const endDate = new Date(end)

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ message: "Start and end must be valid date strings" });
            }

            if (startDate > endDate) {
                return res.status(400).json({ message: "End date must be after start date" });
            }

            //Validate: is_all_day phải là kiểu boolean
            if (typeof is_all_day !== 'boolean') {
                return res.status(400).json({ message: "is_all_day must be a boolean value" });
            }

            const newCalendar = new Calendar({
                userId: req.user.id, // Lấy từ middleware
                title,
                description,
                start,
                end,
                location,
                is_all_day
            })
            await newCalendar.save()

            return res.status(201).json({
                message: "Calendar added successfully",
                calendar: newCalendar
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    updateCalendar: async (req, res) => {
        try {
            const calendarId = req.params.id

            if (!calendarId.trim()) {
                return res.status(400).json({ error: "CalendarID does not empty" })
            }

            if (!mongoose.Types.ObjectId.isValid(calendarId)) {
                return res.status(400).json({ error: "CalendarID is not in the correct format." })
            }

            if (!Calendar.findById(calendarId)) {
                return res.status(404).json({ error: "CalendarID does not exists" })
            }

            const { title, description, start, end, location, is_all_day } = req.body

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: "Body cannot be empty. Please provide calendar details." });
            }

            // Validate: Kiểm tra required
            if (!userId.trim() || !title.trim() || !description.trim() || !start.trim()
                || !end.trim() || !location.trim() || typeof is_all_day === 'undefined') {
                return res.status(400).json({
                    message: "Missing required fields: userId, title, description, start, end, location, is_all_day"
                });
            }

            //Validate
            // Kiểm tra Object
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: "Invalid userId format" });
            }

            //Kiểm tra userId có tồn tại?
            if (!User.findById(userId)) {
                return res.status(400).json({ error: "UserId does not exist" });
            }

            //Validate: start và end là ngày hợp lệ
            const startDate = new Date(start)
            const endDate = new Date(end)

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ message: "Start and end must be valid date strings" });
            }

            if (startDate > endDate) {
                return res.status(400).json({ message: "End date must be after start date" });
            }

            //Validate: is_all_day phải là kiểu boolean
            if (typeof is_all_day !== 'boolean') {
                return res.status(400).json({ message: "is_all_day must be a boolean value" });
            }

            // Tạo object update
            const updatedFields = {
                ...(title && { title }),
                ...(description && { description }),
                ...(start && { start: new Date(start) }),
                ...(end && { end: new Date(end) }),
                ...(location && { location }),
                ...(typeof is_all_day === 'boolean' && { is_all_day })
            };

            const updatedCalendar = await Calendar.findByIdAndUpdate(
                { _id: calendarId, userId: req.user.id }, // Chỉ update calendar của user hiện tại
                updatedFields
            );

            if (!updatedCalendar) {
                return res.status(404).json({ message: "Calendar not found" });
            }

            return res.status(200).json({
                message: "Update successful",
                calendar: updatedCalendar
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    deleteCalendar: async (req, res) => {
        try {
            const calendarId = req.params.id

            if (!calendarId.trim()) {
                return res.status(400).json({ error: "CalendarID does not empty" })
            }

            if (!mongoose.Types.ObjectId.isValid(calendarId)) {
                return res.status(400).json({ error: "CalendarID is not in the correct format." })
            }

            if (!Calendar.findById(calendarId)) {
                return res.status(404).json({ error: "CalendarID does not exists" })
            }

            const deleteCalendar = await Calendar.deleteOne({ _id: calendarId })

            return res.status(200).json({
                message: "Delete successfully!!!",
                delete: deleteCalendar
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },


}