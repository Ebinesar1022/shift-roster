import {
  Doctor,
  Shift,
  ShiftAssignment,
  Roster,
} from "../models";
import { rotateShift } from "./shiftRotationHelper";

export const generateMonthlyRoster = (
  month: number,
  year: number,
  departments: number[],
  doctors: Doctor[],
  shifts: Shift[],
  assignments: ShiftAssignment[]
): Roster[] => {
  const result: Roster[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  departments.forEach((departmentId) => {
    const deptDoctors = doctors.filter(
      (d) => d.departmentId === departmentId
    );

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();

      deptDoctors.forEach((doctor) => {
        const assignedShift = assignments.find(
          (a) =>
            a.departmentId === departmentId &&
            a.doctorId === doctor.id
        );

        if (!assignedShift) return;

        if (doctor.weekOffDay === dayOfWeek) {
          result.push({
            id: Date.now() + Math.random(),
            date: date.toISOString(),
            departmentId,
            shiftId: null,
            doctorId: doctor.id,
            status: "OFF",
          });

          doctor.currentShiftIndex = rotateShift(
            doctor.currentShiftIndex
          );

          return;
        }

        const shift = shifts.find(
          (s) => s.order === doctor.currentShiftIndex
        );

        if (!shift) return;

        result.push({
          id: Date.now() + Math.random(),
          date: date.toISOString(),
          departmentId,
          shiftId: shift.id,
          doctorId: doctor.id,
          status: "WORK",
        });
      });
    }
  });

  return result;
};
