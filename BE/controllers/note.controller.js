const { Note } = require("../models/note.model");

// Lấy tất cả ghi chú chưa bị xoá
exports.showAllNote = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.account.id,
      isDeleted: false,
    }).sort({ _id: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy danh sách ghi chú đã xoá (trong vòng 30 ngày)
// Lấy ghi chú đã bị xóa trong vòng 30 ngày
exports.showDeletedNotes = async (req, res) => {
  try {
    const deletedNotes = await Note.find({
      userId: req.account.id,
      isDeleted: true,
      deletedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 ngày qua
    }).sort({ deletedAt: -1 });

    if (deletedNotes.length === 0) {
      return res.status(404).json({ message: "Không có ghi chú đã bị xóa trong vòng 30 ngày" });
    }

    res.status(200).json(deletedNotes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy chi tiết một ghi chú
exports.showDetailNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.account.id,
      isDeleted: false,
    });
    if (!note)
      return res.status(404).json({ message: "Không tìm thấy ghi chú" });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Thêm ghi chú mới
exports.addNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Tiêu đề và nội dung không được bỏ trống" });
    }

    const newNote = new Note({
      userId: req.account.id,
      title,
      content,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Cập nhật ghi chú
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.account.id, isDeleted: false },
      { title, content },
      { new: true }
    );

    if (!note) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy ghi chú để cập nhật" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Xoá mềm ghi chú
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.account.id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Không tìm thấy ghi chú để xoá" });
    }

    res.status(200).json({ message: "Đã chuyển ghi chú vào danh sách đã xoá" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Khôi phục ghi chú đã xoá
exports.restoreNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.account.id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!note) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy ghi chú để khôi phục" });
    }

    res.status(200).json({ message: "Đã khôi phục ghi chú thành công", note });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};



exports.countNotes = async (req, res) => {
  try {
    const notes = await Note.aggregate([
      {
        $match: {
          userId: req.account.id,
          isDeleted: false,
          createdAt: { $type: "date" } // Thêm điều kiện này
        },
      },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $group: {
          _id: "$day",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      total: notes.length,
      notes: notes.map(note => ({
        date: note._id,
        count: note.count,
      })),
    });
  } catch (error) {
    console.error("Lỗi backend:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



