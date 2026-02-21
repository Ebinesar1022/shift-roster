import { Doctor } from "../models";

const weekDays = [0, 1, 2, 3, 4, 5, 6]; // Sun-Sat

export const getNextWeekOff = (
  existingDoctors: Doctor[],
  departmentId: number
) => {
  const customCycle = [1, 3, 5, 0, 2, 4, 6]; // Mon → Wed → Fri → Sun → Tue → Thu → Sat

  const deptDoctors = existingDoctors.filter(
    (d) => Number(d.departmentId) === Number(departmentId)
  );

  const nextIndex = deptDoctors.length % customCycle.length;

  return customCycle[nextIndex];
};
export const getWeekDayName = (day: number) => {
  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return names[day];
};
