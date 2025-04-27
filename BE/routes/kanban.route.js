const express = require("express");
const kanbanController = require("../controllers/kanban.controller");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");

router.get("/kanban", verifyToken, kanbanController.showAllKanban);
router.post("/kanban", verifyToken, kanbanController.createKanban);

router.put(
  "/kanban/:boardId/add-task",
  verifyToken,
  kanbanController.addTaskToColumn
);
router.put(
  "/kanban/:boardId/add-column",
  verifyToken,
  kanbanController.addColumnToBoard
);
router.put(
  "/kanban/:boardId/move-task",
  verifyToken,
  kanbanController.moveTaskBetweenColumns
);
router.put(
  "/kanban/:boardId/delete-task",
  verifyToken,
  kanbanController.deleteTaskFromColumn
);
router.put(
  "/kanban/:boardId/delete-column",
  verifyToken,
  kanbanController.deleteColumnFromBoard
);
// Tổng hợp Put
router.put(
  "/kanban/:boardId/column-action",
  verifyToken,
  kanbanController.updateKanbanColumn
);

router.delete("/kanban/:boardId", verifyToken, kanbanController.deleteKanban);

module.exports = router;
