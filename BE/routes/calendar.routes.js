const express = require('express');
const calendarController = require('../controllers/calendar.controller')
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

router.get("/calendar", verifyToken, calendarController.showAllCalendar)
router.get("/calendar/:id", verifyToken, calendarController.showDetailCalendar);
router.post("/calendar", verifyToken, calendarController.addCalendar);
router.put("/calendar/:id", verifyToken, calendarController.updateCalendar);
router.delete("/calendar/:id", verifyToken, calendarController.deleteCalendar);

module.exports = router;