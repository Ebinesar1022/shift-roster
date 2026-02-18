import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Doctor, Roster, Shift } from "../../models";

interface Props {
  roster: Roster[];
  shifts: Shift[];
  doctors: Doctor[];
}

const RosterCalendar = ({ roster, shifts,doctors }: Props) => {
    const getDoctorName = (id: number) =>
  doctors.find((d) => d.id === id)?.name || "";

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          {shifts.map((shift) => (
            <TableCell key={shift.id}>
              {shift.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {Array.from(new Set(roster.map((r) => r.date))).map(

          (date) => (
            <TableRow key={date}>
              <TableCell>
                {new Date(date).toDateString()}
              </TableCell>

              {shifts.map((shift) => (
                <TableCell key={shift.id}>
                  {roster
                    .filter(
                      (r) =>
                        r.date === date &&
                        r.shiftId === shift.id
                    )
                    .map((r) => getDoctorName(r.doctorId))
                    .join(", ")}
                </TableCell>
              ))}
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};

export default RosterCalendar;
