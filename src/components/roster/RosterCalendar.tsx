import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Stack, alpha, Button } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Roster, Shift, Doctor, Department } from "../../models";
import { Appointment } from "../../models/Appointment";
import { fetchAll } from "../../services/api";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
} from "@mui/material";

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
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const getDoctorName = (id: number) =>
    doctors.find((d) => d.id === id)?.name || "Unknown Doctor";

  const getShiftName = (shiftId: number | null) =>
    shifts.find((s) => s.id === shiftId)?.name || "OFF";

  const getDepartmentName = (id: number) =>
    departments.find((d) => d.id === id)?.name || "Unknown Dept";

  const getShiftColor = (shiftName: string) => {
    switch (shiftName) {
      case "Morning":
        return "#10b981"; // Emerald
      case "Evening":
        return "#f59e0b"; // Amber
      case "Night":
        return "#3b82f6"; // Blue
      case "OFF":
        return "#94a3b8"; // Slate
      default:
        return "#6366f1"; // Indigo
    }
  };
  useEffect(() => {
    const loadAppointments = async () => {
      const data = await fetchAll<Appointment>("appointments");
      setAppointments(data);
    };

    loadAppointments();
  }, []);

  const rosterEvents = roster.map((r, index) => {
    const doctorName = getDoctorName(r.doctorId);
    const shiftName = getShiftName(r.shiftId);
    const deptName = getDepartmentName(r.departmentId);

    return {
      id: `roster-${index}`,
      title:
        r.status === "OFF"
          ? `${doctorName} (OFF)`
          : `${doctorName} | ${shiftName}`,
      extendedProps: { dept: deptName },
      date: r.date,
      backgroundColor: getShiftColor(shiftName),
      borderColor: "transparent",
    };
  });
  const appointmentEvents = appointments.map((a, index) => {
    const doctorName = getDoctorName(a.doctorId);
    const deptName = getDepartmentName(a.departmentId);

    return {
      id: `appointment-${index}`,
      title: `🩺 ${doctorName} - Patient`,
      start: `${a.date}T${a.time}`,
      backgroundColor: "#9c27b0",
      borderColor: "transparent",
      extendedProps: { dept: deptName },
    };
  });

  return (
    <Box sx={{ width: "100%" }}>
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
            mb: 4,
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
            "&:hover": { bgcolor: "#f8fafc !important" },
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
            "&:hover": {
              transform: "translateY(-1px)",
              filter: "brightness(0.9)",
            },
          },
          "& .fc-event-title": {
            fontWeight: 600,
            fontSize: "0.75rem",
            whiteSpace: "normal",
            lineHeight: 1.2,
          },
          // Day Header
          "& .fc-col-header-cell": {
            bgcolor: "#f8fafc",
            py: 1.5,
          },
          "& .fc-col-header-cell-cushion": {
            color: "#64748b",
            fontSize: "0.75rem",
            fontWeight: 800,
            textTransform: "uppercase",
          },
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
            const firstOfMonth = new Date(
              visibleDate.getFullYear(),
              visibleDate.getMonth(),
              1,
            );
            onMonthChange(firstOfMonth.getMonth(), firstOfMonth.getFullYear());
          }}
          events={[...rosterEvents, ...appointmentEvents]}
          eventClick={(info) => {
            setSelectedEvent(info.event);
          }}
          height="auto"
          eventContent={(eventInfo) => (
            <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              <Typography
                variant="caption"
                sx={{ display: "block", fontWeight: 700, lineHeight: 1.1 }}
              >
                {eventInfo.event.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.65rem", opacity: 0.8 }}
              >
                {eventInfo.event.extendedProps.dept}
              </Typography>
            </Box>
          )}
        />
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            },
          }}
        >
          {/* Left Accent Bar Container */}
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                width: 8,
                bgcolor: selectedEvent?.backgroundColor || "#9c27b0",
              }}
            />

            <Box sx={{ flex: 1 }}>
              {/* Header with Close Button */}
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: 3,
                  pb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ color: "#1e293b", lineHeight: 1.2 }}
                >
                  {selectedEvent?.title}
                </Typography>
                <IconButton
                  onClick={() => setSelectedEvent(null)}
                  size="small"
                  sx={{ color: "#94a3b8" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ pb: 3 }}>
                <Stack spacing={2.5}>
                  {/* Section 1: Date & Time Badge */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        bgcolor: "#f1f5f9",
                        p: 1.5,
                        borderRadius: 2,
                        textAlign: "center",
                        minWidth: 65,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={800}
                        color="primary"
                        sx={{ textTransform: "uppercase", display: "block" }}
                      >
                        {selectedEvent?.start?.toLocaleString("en-US", {
                          month: "short",
                        })}
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{ color: "#1e293b" }}
                      >
                        {selectedEvent?.start?.getDate()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{ color: "#1e293b" }}
                      >
                        {selectedEvent?.start?.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", fontWeight: 500 }}
                      >
                        {selectedEvent?.id.includes("appointment")
                          ? "Patient Appointment"
                          : "Staff Rotation"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderStyle: "dashed" }} />

                  {/* Section 2: Metadata List */}
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#94a3b8",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Department
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: "#334155",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        🏢{" "}
                        {selectedEvent?.extendedProps?.dept ||
                          "General Services"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#94a3b8",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Status
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: "#059669",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        ● Active / Scheduled
                      </Typography>
                    </Box>
                  </Stack>

                 
                </Stack>
              </DialogContent>

              {/* Footer Branding/Close */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: "#f8fafc",
                  textAlign: "center",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                
              </Box>
            </Box>
          </Box>
        </Dialog>

        {/* Legend Panel */}
        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #f1f5f9" }}>
          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            flexWrap="wrap"
          >
            {[
              { label: "Morning", color: "#10b981" },
              { label: "Evening", color: "#f59e0b" },
              { label: "Night", color: "#3b82f6" },
              { label: "OFF", color: "#94a3b8" },
            ].map((item) => (
              <Stack
                key={item.label}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: item.color,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: "#64748b" }}
                >
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
