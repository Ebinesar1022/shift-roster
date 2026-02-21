export interface Appointment {
  id: number;
  date: string; // YYYY-MM-DD
  departmentId: number;
  shiftId: number;
  doctorId: number;
  time: string; // HH:mm
  description: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}