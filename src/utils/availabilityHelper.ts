import { Doctor, ShiftAssignment } from "../models";

export const getAssignedDoctorsForShift = (
  departmentId: number,
  shiftId: number,
  assignments: ShiftAssignment[]
) => {
  return assignments
    .filter(
      (a) =>
        a.departmentId === departmentId &&
        a.shiftId === shiftId
    )
    .map((a) => a.doctorId);
};
