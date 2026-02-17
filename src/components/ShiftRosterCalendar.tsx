import React, { useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

interface ShiftEvent {
  title: string;
  date: string;
}

const ShiftRosterCalendar: React.FC = () => {
  const [events, setEvents] = useState<ShiftEvent[]>([
    { title: "Dr A - Morning Shift", date: "2026-02-18" },
    { title: "Dr B - Night Shift", date: "2026-02-19" },
  ]);

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [shiftType, setShiftType] = useState("");

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setOpen(true);
  };

  const handleAddShift = () => {
    const newEvent = {
      title: `${doctorName} - ${shiftType}`,
      date: selectedDate,
    };

    setEvents([...events, newEvent]);
    setOpen(false);
    setDoctorName("");
    setShiftType("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="80vh"
      />

      {/* Add Shift Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Shift</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Doctor Name"
            margin="normal"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Shift Type (Morning/Night)"
            margin="normal"
            value={shiftType}
            onChange={(e) => setShiftType(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAddShift}
          >
            Add Shift
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ShiftRosterCalendar;
