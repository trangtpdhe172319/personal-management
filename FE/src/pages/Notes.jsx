import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false); 
  const [deletedNotes, setDeletedNotes] = useState([]); 

  const API_BASE = "http://localhost:9999/api/note";
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchNotes();
  }, [showDeleted]);

  // Lấy danh sách ghi chú từ API
  const fetchNotes = async () => {
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const filteredNotes = data.filter((note) =>
        showDeleted ? note.isDeleted : !note.isDeleted
      );
      setNotes(filteredNotes);

      // Lưu lại các ghi chú đã xóa
      const deleted = data.filter((note) => note.isDeleted);
      setDeletedNotes(deleted);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  // Thêm mới hoặc cập nhật ghi chú
  const handleAddOrUpdateNote = async () => {
    if (!title.trim() || !content.trim()) return;

    const method = editMode ? "PUT" : "POST";
    const url = editMode ? `${API_BASE}/${currentNoteId}` : API_BASE;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        resetForm();
        fetchNotes();
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  // Xoá ghi chú (xoá mềm)
  const handleDeleteNote = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  // Khôi phục ghi chú đã xoá
  const handleRestoreNote = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}/restore`, {
        method: "PATCH", // Giả sử backend có route để restore ghi chú
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error("Failed to restore note:", err);
    }
  };

  // Chỉnh sửa ghi chú
  const handleEditNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCurrentNoteId(note._id);
    setEditMode(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditMode(false);
    setCurrentNoteId(null);
    setShowForm(false);
  };

  return (
    <div className="m-5 md:m-10 mt-24 p-5 bg-white dark:bg-secondary-dark-bg rounded-2xl">
      <Header category="App" title="Notes" />

      <div className="flex flex-col gap-4">
        <button
          onClick={() => {
            if (showForm && editMode) {
              resetForm(); // exit edit mode if open
            } else {
              setShowForm(!showForm);
              setEditMode(false);
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-fit"
        >
          {showForm ? "Cancel" : "Add New Note"}
        </button>

        {showForm && (
          <div className="bg-gray-50 dark:bg-main-dark-bg p-5 rounded-xl shadow-md flex flex-col gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border p-3 rounded w-full dark:bg-secondary-dark-bg"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={4}
              className="border p-3 rounded w-full dark:bg-secondary-dark-bg"
            />
            <button
              onClick={handleAddOrUpdateNote}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-fit"
            >
              {editMode ? "Update Note" : "Save Note"}
            </button>
          </div>
        )}

        {/* Nút chuyển đổi giữa ghi chú đã xoá và chưa xoá */}
        {/* <button
          onClick={() => {
            setShowDeleted(!showDeleted);
            fetchNotes();
          }}
          className="text-sm text-blue-600 underline w-fit"
        >
          {showDeleted ? "Show Active Notes" : "Show Deleted Notes"}
        </button> */}

        {/* Hiển thị ghi chú đang dùng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-gray-100 dark:bg-main-dark-bg p-5 rounded-2xl shadow hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {note.content}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Created on: {new Date(note.createdAt).toLocaleString("en-GB")}
              </p>
            </div>
          ))}
        </div>

        {/* Hiển thị ghi chú đã xoá */}
        {showDeleted && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Deleted Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deletedNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-gray-100 dark:bg-main-dark-bg p-5 rounded-2xl shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{note.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestoreNote(note._id)}
                        className="text-green-500 hover:text-green-700 text-sm"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Deleted on: {new Date(note.deletedAt).toLocaleString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;
