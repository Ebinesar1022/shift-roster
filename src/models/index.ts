export interface Department {
  id: number;
  name: string;
}

export type Gender = "Male" | "Female";

export interface Doctor {
  id: number;
  name: string;
  email: string;
  gender: Gender;
  religion: string;
  country: string;
  departmentId: number;
  weekOffDay: number; // 0-6 (Sun-Sat)
  currentShiftIndex: number; // 0 Morning,1 Evening,2 Night
}

export interface Shift {
  id: number;
  name: string;
  order: number; // 0,1,2
  startTime: string;
  endTime: string;
}

export interface Roster {
  id: number;
  date: string;
  departmentId: number;
  shiftId: number | null;
  doctorId: number;
  status: "WORK" | "OFF";
}
