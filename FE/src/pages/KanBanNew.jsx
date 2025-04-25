import React, { useEffect, useState } from "react";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { Header } from "../components";
import axios from "axios";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

const KanBanNew = () => {
  const [kanbanData, setKanbanData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [boardName, setBoardName] = useState(""); // 🔹 new
  const [loading, setLoading] = useState(false);

  const fetchKanban = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:9999/api/kanban/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const firstBoard = res.data[0]; // lấy bảng đầu tiên
      const boardColumns = firstBoard?.columns || [];

      const transformedData = boardColumns.flatMap((col) =>
        col.tasks.map((task, idx) => ({
          Id: `${col.title}-${idx}`,
          Status: col.title,
          Summary: task,
        }))
      );

      setColumns(
        boardColumns.map((col) => ({
          headerText: col.title,
          keyField: col.title,
        }))
      );
      setKanbanData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi tải bảng:", err);
      setLoading(false);
    }
  };

  // 🔹 Gửi yêu cầu tạo bảng
  const handleCreateKanban = async () => {
    if (!boardName.trim()) return alert("Nhập tên bảng");

    try {
      await axios.post(
        "http://localhost:9999/api/kanban",
        { boardName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBoardName("");
      fetchKanban(); // 🔄 Tải lại dữ liệu
    } catch (err) {
      console.error("Lỗi khi tạo bảng:", err);
      alert("Không thể tạo bảng mới");
    }
  };

  useEffect(() => {
    fetchKanban();
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Kanban" />

      {/* 🔹 Form tạo bảng */}
      <div className="mb-4 flex gap-2">
        <input
          className="border rounded px-4 py-2 w-64"
          placeholder="Nhập tên bảng mới..."
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <button
          onClick={handleCreateKanban}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tạo bảng
        </button>
      </div>

      {/* Kanban view */}
      {loading ? (
        <p>Đang tải bảng...</p>
      ) : (
        <KanbanComponent
          id="kanban"
          keyField="Status"
          dataSource={kanbanData}
          cardSettings={{ contentField: "Summary", headerField: "Id" }}
        >
          <ColumnsDirective>
            {columns.map((col, idx) => (
              <ColumnDirective key={idx} {...col} />
            ))}
          </ColumnsDirective>
        </KanbanComponent>
      )}
    </div>
  );
};

export default KanBanNew;
