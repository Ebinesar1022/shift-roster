import { Doctor, Shift, ShiftAssignment, Roster } from "../models";
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
      (d) => Number(d.departmentId) === Number(departmentId)
    );

    deptDoctors.forEach((doctor) => {
      const assignedShift = assignments.find(
        (a) =>
          Number(a.departmentId) === Number(departmentId) &&
          Number(a.doctorId) === Number(doctor.id)
      );

      if (!assignedShift) return;

      // 🔥 Start from manually assigned shift
      let shiftIndex = shifts.findIndex(
        (s) => Number(s.id) === Number(assignedShift.shiftId)
      );

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        // ✅ Week Off Day
        if (doctor.weekOffDay === dayOfWeek) {
          result.push({
            id: Date.now() + Math.random(),
            date: date.toISOString(),
            departmentId,
            shiftId: null,
            doctorId: doctor.id,
            status: "OFF",
          });

          // 🔥 Rotate shift AFTER week off
          shiftIndex = (shiftIndex + 1) % shifts.length;

          continue;
        }

        // ✅ Working Day
        const shift = shifts[shiftIndex];

        result.push({
          id: Date.now() + Math.random(),
          date: date.toISOString(),
          departmentId,
          shiftId: shift.id,
          doctorId: doctor.id,
          status: "WORK",
        });
      }
    });
  });

  return result;
};

