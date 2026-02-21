import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Grid as Grid,
  InputAdornment,
  Paper,
  alpha
} from "@mui/material";
import { Doctor } from "../../models";
import { createItem, fetchAll } from "../../services/api";
import { getNextWeekOff, getWeekDayName } from "../../utils/weekOffManager";
 
// Icons
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
 
interface Props {
  departmentId: number;
  onCreated: () => void;
}
 
const DoctorForm = ({ departmentId, onCreated }: Props) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [weekOff, setWeekOff] = useState<number>(1);
 
  const [form, setForm] = useState({
    name: "",
    age: 0,
    email: "",
    phone: "",
    gender: "Male" as "Male" | "Female",
    country: "",
  });
 
  const [errors, setErrors] = useState<any>({});
 
  const loadDoctors = async () => {
  const data = await fetchAll<Doctor>("doctors");

  setDoctors(data);

  const nextWeekOff = getNextWeekOff(data, departmentId);

  setWeekOff(nextWeekOff);
};
 
  useEffect(() => {
  loadDoctors();
}, [departmentId]);
 
  // ✅ Validation Function
  const validate = () => {
    const newErrors: any = {};
 
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }
 
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
 
    if (!form.age || form.age < 23) {
      newErrors.age = "Doctor must be at least 23 years old";
    }
 
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
 
    if (!form.country.trim()) {
      newErrors.country = "Country is required";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async () => {
    if (!validate()) return;
 
    const doctor: Doctor = {
      id: Date.now(),
      ...form,
      departmentId,
      weekOffDay: weekOff,
      currentShiftIndex: 0,
    };
 
    await createItem("doctors", doctor);
    onCreated();
  };
 
  return (
    <Box sx={{ pt: 1 }}>
      {/* Recommendation Section (Unchanged UI) */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: 3,
          bgcolor: alpha("#3b82f6", 0.08),
          border: "1px solid",
          borderColor: alpha("#3b82f6", 0.2)
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
          <EventAvailableIcon />
        </Avatar>
        <Box>
          <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ textTransform: 'uppercase' }}>
            System Recommendation
          </Typography>
          <Typography variant="body1" fontWeight={600} color="text.primary">
            Suggested Week Off: <Box component="span" color="primary.main">{getWeekDayName(weekOff)}</Box>
          </Typography>
        </Box>
      </Paper>
 
      <Grid container spacing={2.5}>
 
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
            }}
          />
        </Grid>
 
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
            }}
          />
        </Grid>
 
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Age"
            type="number"
            onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
            error={!!errors.age}
            helperText={errors.age}
            InputProps={{
              startAdornment: <InputAdornment position="start"><CakeIcon color="action" /></InputAdornment>,
            }}
          />
        </Grid>
 
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>,
            }}
          />
        </Grid>
 
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            fullWidth
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as "Male" | "Female" })}
            InputProps={{
              startAdornment: <InputAdornment position="start"><WcIcon color="action" /></InputAdornment>,
            }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
        </Grid>
 
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Country"
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            error={!!errors.country}
            helperText={errors.country}
            InputProps={{
              startAdornment: <InputAdornment position="start"><PublicIcon color="action" /></InputAdornment>,
            }}
          />
        </Grid>
 
        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ py: 1.5, borderRadius: 3 }}
          >
            Register Doctor
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
 
const Avatar = ({ children, sx }: any) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    ...sx
  }}>
    {children}
  </Box>
);
 
export default DoctorForm;