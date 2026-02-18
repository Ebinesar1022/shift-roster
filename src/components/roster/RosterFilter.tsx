import { Box, Button, MenuItem, Select } from "@mui/material";
import { Department } from "../../models";

interface Props {
  departments: Department[];
  selectedDept: number | "ALL";
  onDeptChange: (value: number | "ALL") => void;
  onGenerate: () => void;
}

const RosterFilter = ({
  departments,
  selectedDept,
  onDeptChange,
  onGenerate,
}: Props) => {
  return (
    <Box mb={3}>
      <Select
        value={selectedDept}
        onChange={(e) =>
          onDeptChange(e.target.value as number | "ALL")
        }
        sx={{ mr: 2 }}
      >
        <MenuItem value="ALL">All Departments</MenuItem>
        {departments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.name}
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
