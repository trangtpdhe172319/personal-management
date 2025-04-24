import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";

const Scheduler = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleObj, setScheduleObj] = useState();
  const [isLoading, setIsLoading] = useState(false);

  console.log("scheduleData", scheduleData);

  // Lấy dữ liệu từ API khi component được render lần đầu
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDllM2ExOThkNjU5M2I0Y2ZkODNjYyIsImlhdCI6MTc0NTQ3OTM0OCwiZXhwIjoxNzQ2MDg0MTQ4fQ.BxG9Wqz1nMNPnhNkrW7THVfgY4rlOc99oCexgtL5dtc";
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:9999/api/calendar", {
        headers: {
          Authorization: `Bearer ${token}`, // chuẩn theo kiểu Bearer token
        },
      });
      const formattedData = response.data.map((event) => ({
        Id: event._id,
        Subject: event.title,
        Description: event.description,
        StartTime: new Date(event.start),
        EndTime: new Date(event.end),
        IsAllDay: event.is_all_day,
        Location: event.location,
      }));

      setScheduleData(formattedData);
    } catch (error) {
      console.error("Error fetching data: ", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const change = (args) => {
    scheduleObj.selectedDate = args.value;
    scheduleObj.dataBind();
  };

  // Hàm tạo sự kiện mới
  const createEvent = async (newEvent) => {
    const eventToSend = {
      title: newEvent.Subject,
      description: newEvent.Description || "",
      start: newEvent.StartTime,
      end: newEvent.EndTime,
      location: newEvent.Location || "",
      is_all_day: newEvent.IsAllDay || false,
    };

    try {
       await axios.post(
        "http://localhost:9999/api/calendar",
        eventToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      fetchData()
      toast.error(error?.response?.data?.error);
     
    }
  };

  const updateEvent = async (updatedEvent) => {
    const eventToSend = {
      title: updatedEvent.Subject,
      description: updatedEvent.Description || "",
      start: updatedEvent.StartTime,
      end: updatedEvent.EndTime,
      location: updatedEvent.Location || "",
      is_all_day: updatedEvent.IsAllDay || false,
    };

    try {
      await axios.put(
        `http://localhost:9999/api/calendar/${updatedEvent.Id}`,
        eventToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      fetchData()
      toast.error(error?.response?.data?.error);
    } 
  };

  // Hàm xóa sự kiện
  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:9999/api/calendar/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      fetchData();
      toast.error(error?.response?.data?.error);
    } 
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "eventCreated") {
      await createEvent(args.data[0]);
    } else if (args.requestType === "eventChanged") {
      await updateEvent(args.data[0]);
    } else if (args.requestType === "eventRemoved") {
      await deleteEvent(args.data[0].Id);
    }
  };

  const onPopupOpen = (args) => {
    if (args.type === "Editor") {
      const element = args.element;

      const recurrenceEditor = element.querySelector(".e-recurrenceeditor");
      const recurrenceLabel = element.querySelector(".e-recurrence-label");
      const recurrenceCheckbox = element.querySelector(".e-recurrence-editor");

      if (recurrenceEditor) recurrenceEditor.style.display = "none";
      if (recurrenceLabel) recurrenceLabel.style.display = "none";
      if (recurrenceCheckbox) recurrenceCheckbox.style.display = "none";
      const timezoneRow = element.querySelector(".e-time-zone-container");
      if (timezoneRow) timezoneRow.style.display = "none";
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <h2 className="text-xl font-semibold">Lịch trình công việc</h2>
      {/* {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Oval
            height={40}
            width={40}
            color="#000"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#666"
            strokeWidth={3}
            strokeWidthSecondary={3}
          />
        </div>
      )} */}
      <ToastContainer />
      <ScheduleComponent
        height="650px"
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={new Date()}
        eventSettings={{ dataSource: scheduleData }}
        actionComplete={handleActionComplete} // Xử lý actionComplete
        popupOpen={onPopupOpen}
      >
        <ViewsDirective>
          {["Day", "Week", "WorkWeek", "Month", "Agenda"].map((item) => (
            <ViewDirective key={item} option={item} />
          ))}
        </ViewsDirective>
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
      <div className="mt-5">
        <DatePickerComponent
          value={new Date()}
          showClearButton={false}
          placeholder="Ngày hiện tại"
          floatLabelType="Always"
          change={change}
        />
      </div>
    </div>
  );
};

export default Scheduler;
