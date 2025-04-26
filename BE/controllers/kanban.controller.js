const mongoose = require('mongoose');
const Calendar = require("../models/calendar.model");
const User = require("../models/user.model");
const Kanban = require("../models/kanban.model");

const showAllKanban = async (req, res) => {
    try {
        const userId = req.account?.id;

        if (!userId) {
            return res.status(400).json({ message: "Không có userId trong token" });
        }

        const kanban = await Kanban.find({ userId });
        if (!kanban || kanban.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy bảng Kanban nào cho người dùng này" });
        }

        return res.status(200).json(kanban);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
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
        console.log(error);

        res.status(500).json({ message: "Lỗi server", error });
    }
};

// POST /kanban

const createKanban = async (req, res) => {
    try {
        const { boardName, columns } = req.body;
        const userId = req.user.id;

        // Validate boardName
        if (!boardName || typeof boardName !== "string" || boardName.trim() === "") {
            return res.status(400).json({ message: "Tên bảng Kanban không hợp lệ." });
        }

        // Validate columns
        if (!Array.isArray(columns) || columns.length === 0) {
            return res.status(400).json({ message: "Phải có ít nhất một column." });
        }

        for (const column of columns) {
            if (!column.title || typeof column.title !== "string" || column.title.trim() === "") {
                return res.status(400).json({ message: "Mỗi column phải có title hợp lệ." });
            }
            if (!Array.isArray(column.tasks)) {
                return res.status(400).json({ message: "Tasks phải là một mảng." });
            }
            for (const task of column.tasks) {
                if (typeof task !== "string") {
                    return res.status(400).json({ message: "Mỗi task phải là một chuỗi." });
                }
            }
        }

        const newKanban = new Kanban({
            userId,
            boardName: boardName.trim(),
            columns,
        });

        await newKanban.save();

        res.status(201).json({ message: "Tạo Kanban thành công", kanban: newKanban });
    } catch (error) {
        console.error("Error creating Kanban:", error);
        res.status(500).json({ message: "Tạo Kanban thất bại" });
    }
};



// Thêm task vào 1 column cụ thể (PUT /kanban/:boardId/add-task)
const addTaskToColumn = async (req, res) => {
    const { boardId } = req.params;
    const { columnTitle, task } = req.body;

    try {
        const kanban = await Kanban.findById(boardId);
        if (!kanban) return res.status(404).json({ message: "Kanban không tìm thấy" });

        const column = kanban.columns.find(col => col.title === columnTitle);
        if (!column) return res.status(404).json({ message: "Cột không tìm thấy" });

        column.tasks.push(task);
        await kanban.save();

        res.status(200).json({ message: "Thêm task thành công", kanban });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Thêm cột mới vào bảng (PUT /kanban/:boardId/add-column)
const addColumnToBoard = async (req, res) => {
    const { boardId } = req.params;
    const { columnTitle } = req.body;

    try {
        const kanban = await Kanban.findById(boardId);
        if (!kanban) return res.status(404).json({ message: "Kanban không tìm thấy" });

        kanban.columns.push({ title: columnTitle, tasks: [] });
        await kanban.save();

        res.status(200).json({ message: "Thêm cột thành công", kanban });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Di chuyển task giữa 2 cột (PUT /kanban/:boardId/move-task)
const moveTaskBetweenColumns = async (req, res) => {
    const { boardId } = req.params;
    const { fromColumnTitle, toColumnTitle, task } = req.body;

    try {
        const kanban = await Kanban.findById(boardId);
        if (!kanban) return res.status(404).json({ message: "Kanban không tìm thấy" });

        const fromColumn = kanban.columns.find(col => col.title === fromColumnTitle);
        const toColumn = kanban.columns.find(col => col.title === toColumnTitle);

        if (!fromColumn || !toColumn) return res.status(404).json({ message: "Cột không tìm thấy" });

        // Xóa task ở cột cũ
        fromColumn.tasks = fromColumn.tasks.filter(t => t !== task);

        // Thêm task vào cột mới
        toColumn.tasks.push(task);

        await kanban.save();

        res.status(200).json({ message: "Di chuyển task thành công", kanban });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 1. XÓA TASK – PUT /kanban/:boardId/delete-task
const deleteTaskFromColumn = async (req, res) => {
    const { boardId } = req.params;
    const { columnTitle, task } = req.body;

    try {
        const kanban = await Kanban.findById(boardId);
        if (!kanban) return res.status(404).json({ message: "Không tìm thấy Kanban" });

        const column = kanban.columns.find(col => col.title === columnTitle);
        if (!column) return res.status(404).json({ message: "Không tìm thấy cột" });

        column.tasks = column.tasks.filter(t => t !== task);
        await kanban.save();

        res.status(200).json({ message: "Xóa task thành công", kanban });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

//2. XÓA COLUMN – PUT /kanban/:boardId/delete-column
const deleteColumnFromBoard = async (req, res) => {
    const { boardId } = req.params;
    const { columnTitle } = req.body;

    try {
        const kanban = await Kanban.findById(boardId);
        if (!kanban) return res.status(404).json({ message: "Không tìm thấy Kanban" });

        const before = kanban.columns.length;
        kanban.columns = kanban.columns.filter(col => col.title !== columnTitle);

        if (kanban.columns.length === before) {
            return res.status(404).json({ message: "Không tìm thấy cột cần xóa" });
        }

        await kanban.save();

        res.status(200).json({ message: "Xóa cột thành công", kanban });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
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

const updateKanbanColumn = async (req, res) => {
    const { boardId } = req.params;
    const { action, columnTitle, task, fromColumnTitle, toColumnTitle } = req.body;

    try {
        const kanban = await Kanban.findById(boardId);
        if (!kanban) return res.status(404).json({ message: "Kanban không tìm thấy" });

        switch (action) {
            case "add-task": {
                const column = kanban.columns.find(col => col.title === columnTitle);
                if (!column) return res.status(404).json({ message: "Cột không tìm thấy" });
                column.tasks.push(task);
                break;
            }

            case "add-column": {
                const exists = kanban.columns.some(col => col.title === columnTitle);
                if (exists) return res.status(400).json({ message: "Cột đã tồn tại" });
                kanban.columns.push({ title: columnTitle, tasks: [] });
                break;
            }

            case "move-task": {
                const fromColumn = kanban.columns.find(col => col.title === fromColumnTitle);
                const toColumn = kanban.columns.find(col => col.title === toColumnTitle);
                if (!fromColumn || !toColumn) return res.status(404).json({ message: "Không tìm thấy cột" });
                fromColumn.tasks = fromColumn.tasks.filter(t => t !== task);
                toColumn.tasks.push(task);
                break;
            }

            case "delete-task": {
                const column = kanban.columns.find(col => col.title === columnTitle);
                if (!column) return res.status(404).json({ message: "Không tìm thấy cột" });
                column.tasks = column.tasks.filter(t => t !== task);
                break;
            }

            case "delete-column": {
                const before = kanban.columns.length;
                kanban.columns = kanban.columns.filter(col => col.title !== columnTitle);
                if (kanban.columns.length === before) {
                    return res.status(404).json({ message: "Không tìm thấy cột cần xóa" });
                }
                break;
            }

            default:
                return res.status(400).json({ message: "Hành động không hợp lệ" });
        }

        await kanban.save();
        res.status(200).json({ message: `Thao tác '${action}' thành công`, kanban });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};


module.exports = {
    showAllKanban,
    getKanbanByUser,
    createKanban,
    addTaskToColumn, addColumnToBoard, moveTaskBetweenColumns,
    deleteTaskFromColumn, deleteColumnFromBoard, updateKanbanColumn,
    deleteKanban
};