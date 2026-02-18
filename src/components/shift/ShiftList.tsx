import { Shift } from "../../models";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  shifts: Shift[];
}

const ShiftList = ({ shifts }: Props) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Shift</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Assign Doctors</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shifts.map((shift) => (
          <TableRow key={shift.id}>
            <TableCell>{shift.name}</TableCell>
            <TableCell>
              {shift.startTime} - {shift.endTime}
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/shifts/${shift.id}/assign`)
                }
              >
                Assign
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ShiftList;
