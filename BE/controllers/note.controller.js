const {Note} = require("../models/note.model");

// Lấy tất cả ghi chú của người dùng
exports.showAllNote = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ _id: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy chi tiết một ghi chú
exports.showDetailNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!note)
      return res.status(404).json({ message: "Không tìm thấy ghi chú" });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Thêm mới một ghi chú
exports.addNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Tiêu đề và nội dung không được bỏ trống" });
    }

    const newNote = new Note({
      userId: req.user.id,
      title,
      content,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Cập nhật một ghi chú
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
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

// Xoá một ghi chú
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Không tìm thấy ghi chú để xoá" });
    }

    res.status(200).json({ message: "Đã xoá ghi chú thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
