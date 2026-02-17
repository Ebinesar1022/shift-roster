import { Roster } from "../models";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const DepartmentRosterView = ({ roster }: { roster: Roster[] }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Doctor</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {roster.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.date.slice(0, 10)}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell>{r.doctorId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepartmentRosterView;
