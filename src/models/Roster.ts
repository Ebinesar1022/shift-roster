export interface Roster {
  id: number;
  date: string;
  departmentId: number;
  shiftId: number | null;
  doctorId: number;
  status: "WORK" | "OFF";
}
