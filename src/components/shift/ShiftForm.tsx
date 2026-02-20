import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { createItem } from "../../services/api";
import { Shift } from "../../models";

interface Props {
  onCreated: () => void;
}

const ShiftFormDialog = ({ onCreated }: Props) => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    order: 0,
    startTime: "",
    endTime: "",
  });

  const shiftOrders = [0, 1, 2];

  //  Auto Time Logic
  const handleOrderChange = (value: number | null) => {
    if (value === null) return;

    let start = "";
    let end = "";
    let shiftName = "";

    switch (value) {
      case 0:
        start = "08:00";
        end = "16:00";
        shiftName = "Morning";
        break;
      case 1:
        start = "16:00";
        end = "00:00";
        shiftName = "Evening";
        break;
      case 2:
        start = "00:00";
        end = "08:00";
        shiftName = "Night";
        break;
    }

    setForm((prev) => ({
      ...prev,
      order: value,
      startTime: start,
      endTime: end,
      name: shiftName,
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const shift: Shift = { id: Date.now(), ...form };
    await createItem("shifts", shift);
    onCreated();
    handleClose();
    setForm({ name: "", order: 0, startTime: "", endTime: "" });
  };

  return (
    <Box mb={3}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{
          background: "linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)",
          color: "#fff",
          fontWeight: 600,
          py: 1.5,
          px: 3,
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          "&:hover": {
            background: "linear-gradient(45deg, #2575fc 30%, #6a11cb 90%)",
          },
        }}
      >
        Add Shift
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            minWidth: 400,
            background: "#f9f9ff",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#333" }}>
            Add New Shift
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            {/* Autocomplete Order */}
            <Autocomplete
              options={shiftOrders}
              value={shiftOrders.find((o) => o === form.order) ?? null}
              onChange={(_, value) => handleOrderChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Shift Order (0,1,2)"
                  variant="outlined"
                  fullWidth
                />
              )}
            />

            <TextField
              label="Shift Name"
              fullWidth
              value={form.name}
              disabled
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Start Time"
              type="time"
              fullWidth
              value={form.startTime}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Time"
              type="time"
              fullWidth
              value={form.endTime}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} sx={{ color: "#555" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)",
              color: "#fff",
              fontWeight: 600,
              px: 4,
              py: 1,
              borderRadius: "10px",
              "&:hover": {
                background: "linear-gradient(45deg, #2575fc 30%, #6a11cb 90%)",
              },
            }}
          >
            Create Shift
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftFormDialog;
