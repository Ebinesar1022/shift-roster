import { Box, Button, MenuItem, Select } from "@mui/material";
import { Department, Shift } from "../../models";
interface Props {
  departments: Department[];
  shifts: Shift[];
  selectedDept: number | "ALL";
  selectedShift: number | "ALL";
  onDeptChange: (value: number | "ALL") => void;
  onShiftChange: (value: number | "ALL") => void;
  onGenerate: () => void;
}

const RosterFilter = ({
  departments,
  shifts,
  selectedShift,
  selectedDept,
  onDeptChange,
  onShiftChange,
  onGenerate,
}: Props) => {
  return (
    <Box mb={3}>
      <Select
        value={selectedDept}
        onChange={(e) => onDeptChange(e.target.value as number | "ALL")}
        sx={{ mr: 2 }}
      >
        <MenuItem value="ALL">All Departments</MenuItem>
        {departments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        value={selectedShift}
        onChange={(e) => onShiftChange(e.target.value as number | "ALL")}
        sx={{ mr: 2 }}
      >
        <MenuItem value="ALL">All Shifts</MenuItem>
        {shifts.map((shift) => (
          <MenuItem key={shift.id} value={shift.id}>
            {shift.name}
          </MenuItem>
        ))}
      </Select>

      <Button variant="contained" onClick={onGenerate}>
        Generate
      </Button>
    </Box>
  );
};

export default RosterFilter;
