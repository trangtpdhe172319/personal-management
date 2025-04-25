const mongoose = require('mongoose');
const Calendar = require("../models/calendar.model");
const User = require("../models/user.model");
const Kanban = require("../models/kanban.model");

const showAllKanban = async (req, res) => {
    try {
        const kanban = await Kanban.find();
        console.log(kanban);
        if (!kanban || kanban.length === 0) {
            return res.status(404).json({
                message: "Kanban not found"
            })
        };

        return res.status(200).json(kanban)
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
};

// GET /kanban/:userId - Lấy tất cả bảng của người dùng
const getKanbanByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const kanbanBoards = await Kanban.find({ userId });
        if (!kanbanBoards.length) {
            return res.status(404).json({ message: "Không tìm thấy bảng Kanban nào" });
        }
        res.status(200).json(kanbanBoards);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// POST /kanban - Tạo bảng mới (cần verifyToken)
const createKanban = async (req, res) => {
    const { boardName, columns } = req.body;
    const userId = req.user.id;
  
    try {
      let finalColumns = columns;
  
      // Nếu không gửi thì dùng mặc định
      if (!columns || columns.length === 0) {
        finalColumns = [
          { title: "Todo", tasks: [] },
          { title: "In Progress", tasks: [] },
          { title: "Done", tasks: [] }
        ];
      }
  
      // ✅ Kiểm tra trùng title giữa các cột
      const titles = finalColumns.map(col => col.title);
      const uniqueTitles = [...new Set(titles)];
      if (titles.length !== uniqueTitles.length) {
        return res.status(400).json({ message: "Tên cột bị trùng" });
      }
  
      // ✅ Kiểm tra task trong từng cột có trùng không
      for (const col of finalColumns) {
        const taskSet = new Set(col.tasks);
        if (taskSet.size !== col.tasks.length) {
          return res.status(400).json({
            message: `Cột "${col.title}" chứa task bị trùng`
          });
        }
      }
  
      const newBoard = await Kanban.create({
        userId,
        boardName,
        columns: finalColumns
      });
  
      res.status(201).json(newBoard);
    } catch (error) {
      res.status(500).json({ message: "Không thể tạo bảng", error });
    }
  };
  

// PUT /kanban/:boardId - Cập nhật bảng
const updateKanban = async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user.id;
    const update = req.body;

    try {
        const updated = await Kanban.findOneAndUpdate(
            { _id: boardId, userId },
            update,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Không tìm thấy bảng để cập nhật" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật", error });
    }
};

// DELETE /kanban/:boardId - Xoá bảng
const deleteKanban = async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user.id;

    try {
        const deleted = await Kanban.findOneAndDelete({ _id: boardId, userId });
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy bảng để xoá" });
        res.status(200).json({ message: "Đã xoá thành công", boardId });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xoá", error });
    }
};

module.exports = {
    showAllKanban,
    getKanbanByUser,
    createKanban,
    updateKanban,
    deleteKanban
};