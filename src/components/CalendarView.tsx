import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const CalendarView = ({ roster }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Shift</TableCell>
          <TableCell>Doctor</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {roster.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.date.slice(0, 10)}</TableCell>
            <TableCell>{r.shiftId ?? "OFF"}</TableCell>
            <TableCell>{r.doctorId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CalendarView;
