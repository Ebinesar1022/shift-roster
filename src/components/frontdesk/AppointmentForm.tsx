import { useState } from "react";
import { 
  Box, TextField, MenuItem, Button, Stack, Typography, 
  Paper, InputAdornment, Divider, alpha 
} from "@mui/material";
import { 
  CalendarMonth, Business, Timer, Person, Description, AccessTime 
} from "@mui/icons-material";
import { createItem } from "../../services/api";
import { Department, Shift, Doctor, Roster } from "../../models";
import { Appointment } from "../../models/Appointment";

interface Props {
  departments: Department[];
  shifts: Shift[];
  doctors: Doctor[];
  roster: Roster[];
}

const AppointmentForm = ({ departments, shifts, doctors, roster }: Props) => {
  const [date, setDate] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [shiftId, setShiftId] = useState<number | "">("");
  const [doctorId, setDoctorId] = useState<number | "">("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  // --- LOGIC PRESERVED ---
  const availableDoctors = roster.filter(
    (r) =>
      r.date === date &&
      Number(r.departmentId) === Number(departmentId) &&
      Number(r.shiftId) === Number(shiftId) &&
      r.status !== "OFF",
  );

  const availableDoctorIds = availableDoctors.map((r) => Number(r.doctorId));

  const filteredDoctors =
    date && departmentId && shiftId
      ? doctors.filter((d) => availableDoctorIds.includes(Number(d.id)))
      : [];

  const selectedShift = shifts.find((s) => Number(s.id) === Number(shiftId));

  const handleSubmit = async () => {
    if (!date || !departmentId || !shiftId || !doctorId || !time) return;
    if (!selectedShift) { alert("Invalid shift selected"); return; }
    if (time < selectedShift.startTime || time > selectedShift.endTime) {
      alert("Time must be within shift duration");
      return;
    }

    const appointment: Appointment = {
      id: Date.now(),
      date,
      departmentId: Number(departmentId),
      shiftId: Number(shiftId),
      doctorId: Number(doctorId),
      time,
      description,
      status: "SCHEDULED",
    };

    await createItem("appointments", appointment);
    alert("Appointment Assigned!");
  };

  // --- STYLING MAC-STYLE CONFIG ---
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: '#1e293b', borderWidth: '1px' },
    },
    '& .MuiInputLabel-root': { color: '#64748b', fontWeight: 500 },
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={800} color="#1e293b">New Appointment</Typography>
        <Typography variant="body2" color="#64748b">Fill in the details to schedule a patient visit.</Typography>
      </Box>

      <Stack spacing={4}>
        {/* Section 1: Logistics */}
        <Box>
          <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 1.2 }}>General Information</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
            <TextField
              type="date"
              label="Select Date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              sx={inputSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><CalendarMonth fontSize="small" /></InputAdornment>,
              }}
            />

            <TextField
              select
              label="Department"
              value={departmentId}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
              sx={inputSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Business fontSize="small" /></InputAdornment>,
              }}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <Divider />

        {/* Section 2: Shift & Staff */}
        <Box>
          <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 1.2 }}>Shift & Doctor</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
            <TextField
              select
              label="Shift Selection"
              value={shiftId}
              onChange={(e) => setShiftId(Number(e.target.value))}
              sx={inputSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Timer fontSize="small" /></InputAdornment>,
              }}
            >
              {shifts.map((shift) => (
                <MenuItem key={shift.id} value={shift.id}>{shift.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Assigned Doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(Number(e.target.value))}
              sx={inputSx}
              disabled={!date || !departmentId || !shiftId}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment>,
              }}
            >
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => <MenuItem key={doc.id} value={doc.id}>{doc.name}</MenuItem>)
              ) : (
                <MenuItem disabled>No doctors available for this shift</MenuItem>
              )}
            </TextField>
          </Box>
        </Box>

        <Divider />

        {/* Section 3: Appointment Details */}
        <Box>
          <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: 1.2 }}>Timing & Description</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              type="time"
              label="Appointment Time"
              InputLabelProps={{ shrink: true }}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              sx={{ ...inputSx, maxWidth: { md: '50%' } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><AccessTime fontSize="small" /></InputAdornment>,
              }}
            />

            <TextField
              label="Patient Details & Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={inputSx}
              placeholder="Enter patient name, history, or reason for visit..."
            />
          </Stack>
        </Box>

        {/* Action Button */}
        <Button 
          variant="contained" 
          disableElevation
          onClick={handleSubmit}
          sx={{ 
            py: 1.8, 
            borderRadius: '12px', 
            bgcolor: '#1e293b', 
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            '&:hover': { bgcolor: '#0f172a' }
          }}
        >
          Schedule Appointment
        </Button>
      </Stack>
    </Paper>
  );
};

export default AppointmentForm;