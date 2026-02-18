import { Doctor } from "../models";

const weekDays = [0, 1, 2, 3, 4, 5, 6]; // Sun-Sat

export const getNextWeekOff = (existingDoctors: Doctor[]) => {
  if (existingDoctors.length === 0) {
    return 1; // Monday if first doctor
  }

  const lastDoctor = existingDoctors[existingDoctors.length - 1];

  return (lastDoctor.weekOffDay + 1) % 7;
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
