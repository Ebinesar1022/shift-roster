import { Doctor, Shift, Roster } from "../models";

export const generateMonthlyRoster = (
  doctors: Doctor[],
  shifts: Shift[],
  departmentId: number,
  month: number,
  year: number
): Roster[] => {
  const result: Roster[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const deptDoctors = doctors.filter(
    (d) => d.departmentId === departmentId
  );

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    const assignedToday = new Set<number>();

    shifts.forEach((shift) => {
      const availableDoctors = deptDoctors.filter((doc) => {
        if (doc.weekOffDay === dayOfWeek) return false;
        if (assignedToday.has(doc.id)) return false;

        // Female night restriction
        if (doc.gender === "Female" && shift.name === "Night")
          return false;

        return doc.currentShiftIndex === shift.order;
      });

      // Avoid same weekOff doctors cluster
      const uniqueWeekOff = new Set<number>();

      availableDoctors.forEach((doc) => {
        if (!uniqueWeekOff.has(doc.weekOffDay)) {
          result.push({
            id: Date.now() + Math.random(),
            date: date.toISOString(),
            departmentId,
            shiftId: shift.id,
            doctorId: doc.id,
            status: "WORK",
          });

          assignedToday.add(doc.id);
          uniqueWeekOff.add(doc.weekOffDay);
        }
      });
    });

    // Assign OFF and rotate
    deptDoctors.forEach((doc) => {
      if (doc.weekOffDay === dayOfWeek) {
        result.push({
          id: Date.now() + Math.random(),
          date: date.toISOString(),
          departmentId,
          shiftId: null,
          doctorId: doc.id,
          status: "OFF",
        });

        // rotate shift after OFF
        doc.currentShiftIndex =
          (doc.currentShiftIndex + 1) % shifts.length;
      }
    });
  }

  return result;
};
