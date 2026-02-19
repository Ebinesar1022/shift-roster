import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Roster, Shift, Doctor } from "../../models";
import "@fullcalendar/common/main.css"; // ✅ v6+ core CSS
 
interface Props {
  roster: Roster[];
  shifts: Shift[];
  doctors: Doctor[];
}
 
const RosterCalendar: React.FC<Props> = ({
  roster,
  shifts,
  doctors,
}) => {
  const getDoctorName = (id: number) =>
    doctors.find((d) => d.id === id)?.name || "Unknown Doctor";
 
  const getShiftName = (shiftId: number | null) =>
    shifts.find((s) => s.id === shiftId)?.name || "OFF";
 
  const getShiftColor = (shiftName: string) => {
    switch (shiftName) {
      case "Morning":
        return "#4CAF50";
      case "Evening":
        return "#FF9800";
      case "Night":
        return "#2196F3";
      case "OFF":
      default:
        return "#BDBDBD";
    }
  };
 
  const events = roster.map((r, index) => {
    const doctorName = getDoctorName(r.doctorId);
    const shiftName = getShiftName(r.shiftId);
 
    const eventDate = new Date(r.date).toISOString().split("T")[0];
 
    return {
      id: String(index),
      title:
        r.status === "OFF"
          ? `${doctorName} (OFF)`
          : `${doctorName} - ${shiftName}`,
      date: eventDate,
      backgroundColor: getShiftColor(shiftName),
      textColor: "#fff",
    };
  });
 
  return (
    <div style={{ padding: "20px", borderRadius: "8px", background: "#f4f6f8" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        height="auto"
      />
    </div>
  );
};
 
export default RosterCalendar;