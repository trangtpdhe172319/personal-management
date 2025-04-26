// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axiosInstance from "./Authentication/helper/axiosInstance";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const Dashboard = () => {
  const [noteData, setNoteData] = useState([]);
  const [data, setData] = useState({
    kanban: { todo: 0, inprogress: 0, done: 0 },
    calendar: { date: "", tasks: [] },
  });

  useEffect(() => {
    fetchNoteCount();
    fetchDashboard();
  }, []);

  const fetchNoteCount = async () => {
    try {
      const response = await axiosInstance.get("/api/dashboard/count-notes");
      setNoteData(response.data); 
    } catch (error) {
      console.error("Lỗi khi lấy tổng số ghi chú:", error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get("/api/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const kanbanPieData = [
    { name: "To Do", value: data.kanban.todo },
    { name: "In Progress", value: data.kanban.inprogress },
    { name: "Done", value: data.kanban.done },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Notes theo ngày */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Số lượng Note theo ngày</h2>
        {noteData.length === 0 ? (
          <p className="text-gray-500 text-center">Không có ghi chú nào.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={noteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Kanban Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Kanban Tasks</h2>
        {kanbanPieData.every(item => item.value === 0) ? (
          <p className="text-gray-500 text-center">Không có công việc Kanban nào.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={kanbanPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {kanbanPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Calendar - Công việc ngày */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Công việc ngày {data.calendar.date ? data.calendar.date : "(chưa có ngày nào)"}
        </h2>
        {data.calendar.tasks.length === 0 ? (
          <p className="text-gray-500">Không có công việc nào.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {data.calendar.tasks.map((task, index) => (
              <li key={index}>{task.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
