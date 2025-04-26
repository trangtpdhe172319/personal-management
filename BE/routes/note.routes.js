const express = require("express");
const router = express.Router(); // <- thêm dòng này nè
const noteController = require("../controllers/note.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.get("/note", verifyToken, noteController.showAllNote);
router.get("/note/deleted", verifyToken, noteController.showDeletedNotes); 
router.get("/note/:id", verifyToken, noteController.showDetailNote);
router.post("/note", verifyToken, noteController.addNote);
router.put("/note/:id", verifyToken, noteController.updateNote);
router.put("/note/:id/restore", verifyToken, noteController.restoreNote); 
router.delete("/note/:id", verifyToken, noteController.deleteNote);
router.get("/dashboard/count-notes", verifyToken, noteController.countNotes);

module.exports = router;
