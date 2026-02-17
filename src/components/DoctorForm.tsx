import {
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { useState } from "react";
import { createItem } from "../services/api";
import { Doctor } from "../models";
import { getNextWeekOff } from "../utils/weekOffManager";

interface Props {
  departmentId: number;
  refresh: () => void;
}

const DoctorForm = ({ departmentId, refresh }: Props) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "Male",
    religion: "",
    country: "",
  });

  const handleSubmit = async () => {
    const doctor: Doctor = {
      id: Date.now(),
      ...form,
      departmentId,
      weekOffDay: getNextWeekOff(),
      currentShiftIndex: 0,
    };

    await createItem("doctors", doctor);
    refresh();
  };

  return (
    <Box>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <TextField
        select
        label="Gender"
        fullWidth
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, gender: e.target.value })
        }
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </TextField>

      <TextField
        label="Religion"
        fullWidth
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, religion: e.target.value })
        }
      />

      <TextField
        label="Country"
        fullWidth
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
