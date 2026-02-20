import { Doctor, Shift, ShiftAssignment, Roster } from "../models";
import { rotateShift } from "./shiftRotationHelper";
export const generateMonthlyRoster = (
  month: number,
  year: number,
  departments: number[],
  doctors: Doctor[],
  shifts: Shift[],
  assignments: ShiftAssignment[],
  existingRosters: Roster[],
): Roster[] => {
  const result: Roster[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  departments.forEach((departmentId) => {
    const deptDoctors = doctors.filter(
      (d) => Number(d.departmentId) === Number(departmentId),
    );

    deptDoctors.forEach((doctor) => {
      const assignedShift = assignments.find(
        (a) =>
          Number(a.departmentId) === Number(departmentId) &&
          Number(a.doctorId) === Number(doctor.id),
      );

      if (!assignedShift) return;

      // 👇 Check previous month
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;

      const prevMonthData = existingRosters
        .filter(
          (r) =>
            r.doctorId === doctor.id &&
            r.departmentId === departmentId &&
            r.month === prevMonth &&
            r.year === prevYear,
        )
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      let shiftIndex;

      // If previous month exists
      if (prevMonthData.length > 0) {
        const lastDay = prevMonthData[prevMonthData.length - 1];

        if (lastDay.shiftId) {
          shiftIndex = shifts.findIndex((s) => s.id === lastDay.shiftId);
        }
      }

      // If no previous month data → start from assigned shift
      if (shiftIndex === undefined) {
        shiftIndex = shifts.findIndex(
          (s) => Number(s.id) === Number(assignedShift.shiftId),
        );
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        // ✅ Week Off Day
        if (doctor.weekOffDay === dayOfWeek) {
          result.push({
            id: Date.now() + Math.random(),
            date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
            month,
            year,
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
          date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          month,
          year,
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
