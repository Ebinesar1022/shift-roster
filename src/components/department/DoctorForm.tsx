import { useState, useEffect } from "react";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";
import { Doctor } from "../../models";
import { createItem, fetchAll } from "../../services/api";
import { getNextWeekOff, getWeekDayName } from "../../utils/weekOffManager";

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

  const loadDoctors = async () => {
    const data = await fetchAll<Doctor>("doctors");
    const deptDoctors = data.filter(
      (d) => d.departmentId === departmentId
    );
    setDoctors(deptDoctors);
    setWeekOff(getNextWeekOff(deptDoctors));
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleSubmit = async () => {
    const doctor: Doctor = {
      id: Date.now(),
      ...form,
      departmentId,
      weekOffDay: weekOff,
      currentShiftIndex: 0,
    };

    await createItem("doctors", doctor);
    onCreated();
    loadDoctors();
  };

  return (
    <Box mt={2}>
      <Typography variant="h6">
        Suggested Week Off: {getWeekDayName(weekOff)}
      </Typography>

      <TextField
        fullWidth
        label="Name"
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <TextField
        fullWidth
        label="Age"
        type="number"
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, age: Number(e.target.value) })
        }
      />

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <TextField
        fullWidth
        label="Phone"
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <TextField
        select
        fullWidth
        label="Gender"
        margin="normal"
        value={form.gender}
        onChange={(e) =>
          setForm({
            ...form,
            gender: e.target.value as "Male" | "Female",
          })
        }
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Country"
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, country: e.target.value })
        }
      />

      <Button variant="contained" onClick={handleSubmit}>
        Add Doctor
      </Button>
    </Box>
  );
};

export default DoctorForm;
