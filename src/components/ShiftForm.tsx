import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import { createItem } from "../services/api";
import { Shift } from "../models";

const ShiftForm = ({ refresh }: { refresh: () => void }) => {
  const [form, setForm] = useState({
    name: "",
    order: 0,
    startTime: "",
    endTime: "",
  });

  const handleSubmit = async () => {
    const shift: Shift = {
      id: Date.now(),
      ...form,
    };

    await createItem("shifts", shift);
    refresh();
  };

  return (
    <Box>
      <TextField
        label="Shift Name"
        fullWidth
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <TextField
        label="Shift Order (0-2)"
        type="number"
        fullWidth
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, order: Number(e.target.value) })
        }
      />

      <TextField
        label="Start Time"
        type="time"
        fullWidth
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, startTime: e.target.value })
        }
      />

      <TextField
        label="End Time"
        type="time"
        fullWidth
        margin="normal"
        onChange={(e) =>
          setForm({ ...form, endTime: e.target.value })
        }
      />

      <Button variant="contained" onClick={handleSubmit}>
        Add Shift
      </Button>
    </Box>
  );
};

export default ShiftForm;
