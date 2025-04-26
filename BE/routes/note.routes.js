const express = require("express");
const noteController = require("../controllers/note.controller");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/note", verifyToken, noteController.showAllNote);
router.get("/note/deleted", verifyToken, noteController.showDeletedNotes); // NEW
router.get("/note/:id", verifyToken, noteController.showDetailNote);
router.post("/note", verifyToken, noteController.addNote);
router.put("/note/:id", verifyToken, noteController.updateNote);
router.put("/note/:id/restore", verifyToken, noteController.restoreNote); // NEW
router.delete("/note/:id", verifyToken, noteController.deleteNote);

module.exports = router;
