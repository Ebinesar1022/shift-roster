export interface Roster {
  id: number;
  date: string;
  month: number;
  year: number;
  departmentId: number;
  shiftId: number | null;
  doctorId: number;
  status: "WORK" | "OFF";
}
