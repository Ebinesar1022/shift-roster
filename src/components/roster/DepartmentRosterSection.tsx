import { Typography, Box } from "@mui/material";
import { Roster, Shift } from "../../models";

interface Props {
  departmentName: string;
  roster: Roster[];
  shifts: Shift[];
}

const DepartmentRosterSection = ({
  departmentName,
  roster,
  shifts,
}: Props) => {
  return (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        {departmentName}
      </Typography>

      {shifts.map((shift) => (
        <Box key={shift.id} mb={2}>
          <Typography variant="subtitle1">
            {shift.name}
          </Typography>

          {roster
            .filter((r) => r.shiftId === shift.id)
            .map((r) => (
              <Typography key={r.id}>
                {new Date(r.date).toDateString()} – Doctor {r.doctorId}
              </Typography>
            ))}
        </Box>
      ))}
    </Box>
  );
};

export default DepartmentRosterSection;
