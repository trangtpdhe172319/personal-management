import React, { useEffect, useState } from "react";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";

import { kanbanGrid } from "../data/dummy";
import { Header } from "../components";
import axios from "axios";
import { toast } from "react-toastify";

const Kanban = () => {
  const [kanbanData, setKanbanData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    Summary: '',
    Status: '',
    BoardName: '',
  });

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGJkY2ExZDhkZTIwMGZjODk3NzViZSIsImlhdCI6MTc0NTY2NzA4NSwiZXhwIjoxNzQ1NjcwNjg1fQ.RjwTCDeyxXQTVXmDD1lPHaLUPtESHtBVLPKdskzVRYE";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:9999/api/kanban", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData = response.data.flatMap((kanban) =>
        kanban.columns.flatMap((column) =>
          column.tasks.map((task, index) => ({
            Summary: task,
            Status: column.title,
            BoardName: kanban.boardName,
          }))
        )
      );

      setKanbanData(formattedData);
    } catch (error) {
      console.error("Error fetching data: ", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Lỗi tải kanban");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const createEvent = async (newEvent) => {
    try {
      if (!newEvent?.Summary || !newEvent?.Status || !newEvent?.BoardName) {
        toast.error("Enter required task");
        return;
      }

      await axios.post(
        "http://localhost:9999/api/kanban",
        {
          summary: newEvent.Summary,
          status: newEvent.Status,
          boardName: newEvent.BoardName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Thêm task thành công!");
      fetchData(); // Reload lại dữ liệu
    } catch (error) {
      console.error("Error creating task: ", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Lỗi thêm task");
    }
  };

  const updateEvent = async (updatedEvent) => {
    // TODO: bạn có thể viết thêm hàm update nếu cần
  };

  const deleteEvent = async (deletedEvent) => {
    // TODO: bạn có thể viết thêm hàm delete nếu cần
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "eventCreated") {
      await createEvent(args.data[0]);
    } else if (args.requestType === "eventChanged") {
      await updateEvent(args.data[0]);
    } else if (args.requestType === "eventRemoved") {
      await deleteEvent(args.data[0]);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl relative">
      <Header category="App" title="Kanban" />
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Task
        </button>
      </div>

      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={kanbanData}
        cardSettings={{ contentField: "Summary", headerField: "BoardName" }}
        actionComplete={handleActionComplete}
      >
        <ColumnsDirective>
          {kanbanGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>

      {/* Modal Thêm Task */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

            <input
              type="text"
              placeholder="Summary"
              className="w-full mb-3 p-2 border rounded"
              value={newTaskData.Summary}
              onChange={(e) => setNewTaskData({ ...newTaskData, Summary: e.target.value })}
            />

            <select
              className="w-full mb-3 p-2 border rounded"
              value={newTaskData.Status}
              onChange={(e) => setNewTaskData({ ...newTaskData, Status: e.target.value })}
            >
              <option value="">Choose Status</option>
              {kanbanGrid.map((item, index) => (
                <option key={index} value={item.keyField}>
                  {item.headerText}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="BoardName"
              className="w-full mb-3 p-2 border rounded"
              value={newTaskData.BoardName}
              onChange={(e) => setNewTaskData({ ...newTaskData, BoardName: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                onClick={() => setIsAddModalOpen(false)}
              >
                Huỷ
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={async () => {
                  await createEvent(newTaskData);
                  setIsAddModalOpen(false);
                  setNewTaskData({ Summary: '', Status: '', BoardName: '' });
                }}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
