const express = require('express');
const kanbanController = require('../controllers/kanban.controller')
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

router.get("/kanban", verifyToken, kanbanController.showAllKanban);
router.get("/kanban/:userId", verifyToken, kanbanController.getKanbanByUser);
router.post("/kanban", verifyToken, kanbanController.createKanban);
router.put("/kanban/:boardId", verifyToken, kanbanController.updateKanban);
router.delete("/kanban/:boardId", verifyToken, kanbanController.deleteKanban);

module.exports = router;