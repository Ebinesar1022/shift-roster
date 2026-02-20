import React from "react";
import { Box, Paper, Typography, Stack, alpha } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Roster, Shift, Doctor, Department } from "../../models";
 
interface Props {
  roster: Roster[];
  shifts: Shift[];
  doctors: Doctor[];
  departments: Department[];
  currentDate: Date;
  onMonthChange: (month: number, year: number) => void;
}
 
const RosterCalendar: React.FC<Props> = ({
  roster,
  shifts,
  doctors,
  departments,
  currentDate,
  onMonthChange,
}) => {
  // --- LOGIC PRESERVED ---
  const getDoctorName = (id: number) =>
    doctors.find((d) => d.id === id)?.name || "Unknown Doctor";
 
  const getShiftName = (shiftId: number | null) =>
    shifts.find((s) => s.id === shiftId)?.name || "OFF";
 
  const getDepartmentName = (id: number) =>
    departments.find((d) => d.id === id)?.name || "Unknown Dept";
 
  const getShiftColor = (shiftName: string) => {
    switch (shiftName) {
      case "Morning": return "#10b981"; // Emerald
      case "Evening": return "#f59e0b"; // Amber
      case "Night":   return "#3b82f6"; // Blue
      case "OFF":     return "#94a3b8"; // Slate
      default:        return "#6366f1"; // Indigo
    }
  };
 
  const events = roster.map((r, index) => {
    const doctorName = getDoctorName(r.doctorId);
    const shiftName = getShiftName(r.shiftId);
    const deptName = getDepartmentName(r.departmentId);
 
    return {
      id: String(index),
      title: r.status === "OFF"
        ? `${doctorName} (OFF)`
        : `${doctorName} | ${shiftName}`,
      // Tooltip/Extended info
      extendedProps: { dept: deptName },
      date: r.date,
      backgroundColor: getShiftColor(shiftName),
      borderColor: "transparent",
    };
  });
 
  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, md: 3 },
          borderRadius: 4,
          bgcolor: "white",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
         
          // --- INTERNAL CALENDAR STYLING (REPLACES THE CSS FILE) ---
          "& .fc": {
            fontFamily: "inherit",
            "--fc-border-color": "#f1f5f9",
            "--fc-today-bg-color": alpha("#3b82f6", 0.05),
          },
          // Header Toolbar Styling
          "& .fc-header-toolbar": {
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4
          },
          "& .fc-toolbar-title": {
            fontSize: "1.4rem !important",
            fontWeight: 800,
            color: "#1e293b",
          },
          // Modern Button Styling
          "& .fc-button": {
            bgcolor: "#fff !important",
            color: "#64748b !important",
            border: "1px solid #e2e8f0 !important",
            borderRadius: "8px !important",
            fontWeight: 700,
            fontSize: "0.85rem",
            textTransform: "capitalize",
            boxShadow: "none !important",
            "&:hover": { bgcolor: "#f8fafc !important" }
          },
          "& .fc-button-active": {
            bgcolor: "#1e293b !important",
            color: "white !important",
            borderColor: "#1e293b !important",
          },
          // Event Styling
          "& .fc-event": {
            cursor: "pointer",
            borderRadius: "6px",
            mx: 0.5,
            my: 0.2,
            border: "none",
            p: 0.5,
            transition: "transform 0.1s ease",
            "&:hover": { transform: "translateY(-1px)", filter: "brightness(0.9)" }
          },
          "& .fc-event-title": {
            fontWeight: 600,
            fontSize: "0.75rem",
            whiteSpace: "normal",
            lineHeight: 1.2
          },
          // Day Header
          "& .fc-col-header-cell": {
            bgcolor: "#f8fafc",
            py: 1.5
          },
          "& .fc-col-header-cell-cushion": {
            color: "#64748b",
            fontSize: "0.75rem",
            fontWeight: 800,
            textTransform: "uppercase"
          }
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={currentDate}
          showNonCurrentDates={false}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          datesSet={(arg) => {
            const visibleDate = arg.view.currentStart;
            const firstOfMonth = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), 1);
            onMonthChange(firstOfMonth.getMonth(), firstOfMonth.getFullYear());
          }}
          events={events}
          height="auto"
          eventContent={(eventInfo) => (
            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, lineHeight: 1.1 }}>
                {eventInfo.event.title}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.8 }}>
                {eventInfo.event.extendedProps.dept}
              </Typography>
            </Box>
          )}
        />
 
        {/* Legend Panel */}
        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #f1f5f9" }}>
          <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
            {[
              { label: "Morning", color: "#10b981" },
              { label: "Evening", color: "#f59e0b" },
              { label: "Night", color: "#3b82f6" },
              { label: "OFF", color: "#94a3b8" },
            ].map((item) => (
              <Stack key={item.label} direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b" }}>
                  {item.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
 
export default RosterCalendar;