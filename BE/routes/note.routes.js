const express = require('express');
const noteController = require('../controllers/note.controller')
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

router.get("/note", verifyToken, noteController.showAllNote);
router.get("/note/:id", verifyToken, noteController.showDetailNote);
router.post("/note", verifyToken, noteController.addNote);
router.put("/note/:id", verifyToken, noteController.updateNote);
router.delete("/note/:id", verifyToken, noteController.deleteNote);

module.exports = router;