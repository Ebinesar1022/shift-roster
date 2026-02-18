import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { createItem } from "../../services/api";
import { Shift } from "../../models";

interface Props {
  onCreated: () => void;
}

const ShiftForm = ({ onCreated }: Props) => {
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
    onCreated();
  };

  return (
    <Box mb={3}>
      <TextField
        label="Shift Name"
        margin="normal"
        fullWidth
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <TextField
        label="Order (0-Morning,1-Evening,2-Night)"
        type="number"
        margin="normal"
        fullWidth
        onChange={(e) =>
          setForm({ ...form, order: Number(e.target.value) })
        }
      />

      <TextField
        label="Start Time"
        type="time"
        margin="normal"
        fullWidth
        onChange={(e) =>
          setForm({ ...form, startTime: e.target.value })
        }
      />

      <TextField
        label="End Time"
        type="time"
        margin="normal"
        fullWidth
        onChange={(e) =>
          setForm({ ...form, endTime: e.target.value })
        }
      />

      <Button variant="contained" onClick={handleSubmit}>
        Create Shift
      </Button>
    </Box>
  );
};

export default ShiftForm;
