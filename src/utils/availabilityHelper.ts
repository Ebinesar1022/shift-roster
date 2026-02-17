import { Doctor, Shift, Roster } from "../models";

export const isDoctorAvailable = (
  doctor: Doctor,
  shift: Shift,
  date: Date,
  existingRoster: Roster[]
) => {
  const dayOfWeek = date.getDay();

  // Week off check
  if (doctor.weekOffDay === dayOfWeek) {
    return false;
  }

  // Already assigned same day
  const alreadyAssigned = existingRoster.find(
    (r) =>
      r.doctorId === doctor.id &&
      new Date(r.date).toDateString() === date.toDateString() &&
      r.status === "WORK"
  );

  if (alreadyAssigned) {
    return false;
  }

  // Female night restriction
  if (doctor.gender === "Female" && shift.name === "Night") {
    return false;
  }

  return true;
};
